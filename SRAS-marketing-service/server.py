from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
from mlxtend.frequent_patterns import fpgrowth
from mlxtend.frequent_patterns import association_rules
import warnings
import os
import json

warnings.filterwarnings("ignore", category=pd.errors.PerformanceWarning)

app = Flask(__name__)
CORS(app)


@app.route('/')
def index():
    return "Upload a CSV file at /upload"


@app.route('/associations', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if not file.filename.endswith('.csv'):
        return jsonify({'error': 'Only CSV files are allowed'}), 400

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        # Save the uploaded file
        filepath = os.path.join(
            "SRAS-marketing-service/Uploads", file.filename)
        file.save(filepath)

        df = pd.read_csv(filepath)
        df['StockCode'] = df['StockCode'].astype("str")

        # Generate association rules
        total_rules = []
        for i in range(3):
            print(i, "stage 1")
            segment = (df[df['Class'] == i])[['InvoiceNo', 'StockCode']].groupby(
                'InvoiceNo')['StockCode'].agg(list).reset_index().set_index('InvoiceNo')
            unique_products = set(
                product for sublist in segment["StockCode"] for product in sublist)
            for product in unique_products:
                segment[product] = segment["StockCode"].apply(
                    lambda x: 1 if product in x else 0)
            print(i, "stage 2")
            segment.drop(columns=['StockCode'], inplace=True)
            for c in segment.columns:
                segment[c] = segment[c].astype("bool")
            res = fpgrowth(segment, min_support=0.02, use_colnames=True)
            print(i, "stage 3")
            res = association_rules(
                res, metric="confidence", min_threshold=0.5)
            sorted_results = res.sort_values(by="lift", ascending=False)

            rules = []
            for index, row in sorted_results.iterrows():
                antecedent = str(row['antecedents']).replace(
                    'frozenset', '').replace('{', '').replace('}', '')
                consequent = str(row['consequents']).replace(
                    'frozenset', '').replace('{', '').replace('}', '')
                percentage = f"{row['confidence']*100:.2f}%"
                rule = {'product_1': consequent,
                        'product_2': antecedent, 'percentage': percentage}
                if row['confidence'] > 0.75:
                    rules.append(rule)
            total_rules.append({'segment': i + 1, 'rules': rules})
            print(i, "stage 4")

        # Generate top 10 products for each segment
        segments = []
        for segment in range(3):
            segment_df = df[df['Class'] == segment]
            products = segment_df['StockCode'].value_counts().head(
                10).index.to_list()
            values = segment_df['StockCode'].value_counts().head(
                10).values.tolist()
            segments.append({
                'segment': segment + 1,
                'title': 'Top 10 Products',
                'x_axis': 'Product',
                'y_axis': 'Count',
                'products': products,
                'values': values
            })

        transformed_segments = [
            {
                "title": f"Segment {data['segment']}",
                "barChart": [{"x_value": product, "y_value": value} for product, value in zip(data["products"], data["values"])]
            }
            for data in segments
        ]

        # Prepare the response
        response = {
            'association_rules': total_rules,
            'top_products': transformed_segments
        }

        # Save response to a JSON file
        output_filename = 'associations.json'
        # ###############################################################
        # change the path
        output_filepath = os.path.join(
            "SRAS-marketing-service/Outputs", output_filename)
        with open(output_filepath, 'w') as f:
            json.dump(response, f, indent=4)

        return jsonify({'message': f'Output saved as {output_filename}'}), 200


@app.route('/associations', methods=['GET'])
def get_output():
    output_filename = 'associations.json'
    output_filepath = os.path.join(
        "Outputs", output_filename)
    try:
        return send_file(output_filepath, mimetype='application/json', as_attachment=True)
    except:
        return jsonify([])


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=False)
