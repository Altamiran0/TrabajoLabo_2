#ifndef WIFI_H
#define WIFI_H

#include <ESP8266WiFi.h>
#include <FS.h>
#include <LittleFS.h>

const char* ssid = "JR-CON9330";
const char* password = "AltCon9371";

void iniciarWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("Conectando a WiFi");

  unsigned long startTime = millis();
  while ( WiFi.status() != WL_CONNECTED ) {
    delay(500);
    Serial.print(".");

    if (millis() - startTime > 10000) { // 10 segundos de espera
    Serial.println("⛔ No se pudo conectar a WiFi");
    return;
  }
  }
  Serial.println( "\nConectado a WiFi" );
  Serial.print( "IP: " );
  Serial.println( WiFi.localIP() );

  // Montar LittleFS
  if (!LittleFS.begin()) {
    Serial.println("Error montando LittleFS");
    return;
  }
}

#endif
