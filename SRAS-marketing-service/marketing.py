from flask import Flask, jsonify, request

app = Flask(__name__)

# In-memory storage for settings
settings = []

@app.route('/')
def index():
    return "Welcome to the settings API. Use /api/settings or /api/hello."

@app.route('/api/settings', methods=['GET'])
def fetch_settings():
    try:
        if not settings:
            return jsonify({'message': 'Settings not found'}), 404
        return jsonify(settings), 200
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/settings', methods=['POST'])
def create_or_update_settings():
    try:
        data = request.get_json()
        full_name = data.get('FullName')

        # Check if settings already exist by FullName
        existing_settings = next((s for s in settings if s['FullName'] == full_name), None)

        if existing_settings:
            # Update existing settings
            existing_settings.update(data)
            saved_settings = existing_settings
        else:
            # Create new settings
            saved_settings = data
            settings.append(saved_settings)

        return jsonify(saved_settings), 200
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/settings/<ReportFrequency>', methods=['DELETE'])
def delete_settings(ReportFrequency):
    try:
        # Convert the id to an integer, assuming it's a simple numeric ID
        settings_ReportFrequency = int(ReportFrequency)

        # Find the index of the settings to be deleted
        settings_index = next((i for i, s in enumerate(settings) if s.get('ReportFrequency') == settings_ReportFrequency), None)

        if settings_index is None:
            return jsonify({'message': 'Settings not found'}), 404

        # Remove the settings from the list
        deleted_settings = settings.pop(settings_index)
        return jsonify({'message': 'Settings deleted'}), 201
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
