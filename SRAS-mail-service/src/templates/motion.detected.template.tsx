import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export interface MotionDetectedProps {
  CameraName?: string;
  ZoneName?: string;
}

export const MotionDetectedTemplate = ({
  CameraName,
  ZoneName,
}: MotionDetectedProps) => {
  const formattedDate = new Intl.DateTimeFormat("en", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date());
  return (
    <Html>
      <Head />
      <Preview>Motion Detected</Preview>
      <Body style={main}>
        <Container>
          <Section style={content}>
            <Row style={{ ...boxInfos, paddingBottom: "0" }}>
              <Column>
                <Heading
                  style={{
                    fontSize: 32,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  🕒
                </Heading>

                <Text style={paragraph}>
                  <b>Camera Name: </b>
                  {CameraName}
                </Text>

                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>Zone: </b>
                  {ZoneName}
                </Text>

                <Text style={{ ...paragraph, marginTop: -5 }}>
                  <b>Time of Motion Detection: </b>
                  {formattedDate}
                </Text>
              </Column>
            </Row>
          </Section>

          <Text
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "rgb(0,0,0, 0.7)",
            }}
          >
            © 2024 | SRAS, Egypt | www.sras.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
};
MotionDetectedTemplate.Subject = "Alert - Motion Detected";
export default MotionDetectedTemplate;

const main = {
  backgroundColor: "#fff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const paragraph = {
  fontSize: 16,
};

const content = {
  border: "1px solid rgb(0,0,0, 0.1)",
  borderRadius: "3px",
  overflow: "hidden",
};

const boxInfos = {
  padding: "20px",
};
