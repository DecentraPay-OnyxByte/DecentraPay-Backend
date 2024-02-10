#include <ArduinoHttpClient.h>
#include <SPI.h>
#include <Ethernet.h>
#include <PCM.h>

// Define the Arduino's Ethernet settings
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
IPAddress serverIP(192, 168, 1, 100); // Change this to your server's IP address
int serverPort = 3000; // Change this to your server's port

// Define the HTTP client
EthernetClient client;
HttpClient http(client, serverIP, serverPort);

void setup() {
  // Initialize Serial communication
  Serial.begin(9600);

  // Start the Ethernet connection
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP");
    while (true);
  }
  delay(1000);
}

void loop() {
 
  if (http.get("/send-audio-message")) {
    if (http.responseStatusCode() == 200) {

        uint8_t buffer[512];
        size_t bytesRead = http.readBytes(buffer, sizeof(buffer));

        PCM.playBuffer(buffer, bytesRead);
      }
    } else {
      Serial.print("HTTP request failed with status code ");
      Serial.println(http.responseStatusCode());
    }
  } else {
    Serial.println("HTTP request failed");
  }


  delay(5000);
}
