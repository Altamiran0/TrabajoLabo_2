#ifndef WEBSERVER_H
#define WEBSERVER_H

#include <ESP8266WebServer.h>
#include "buffer.h"
#include "reloj.h"
#include "sensores.h"

ESP8266WebServer server(80);

void handleFileRead(String path) {
  Serial.println("Petición por: " + path);

  if (path.endsWith("/")) path += "index.html";

  String contentType = "text/plain";
  if (path.endsWith(".html")) contentType = "text/html";
  else if (path.endsWith(".css")) contentType = "text/css";
  else if (path.endsWith(".js")) contentType = "application/javascript";

  if (LittleFS.exists(path)) {
    File file = LittleFS.open(path, "r");
    server.streamFile(file, contentType);
    file.close();
    return;
  }

  server.send(404, "text/plain", "File Not Found" + path);
}

void enviarDatos( float temperatura, float humedad, float presion, unsigned long tiempoDeMedicion) {
  String json = "{";
      json += "\"temperature\":" + String(temperatura, 1) + ",";
      json += "\"humidity\":" + String(humedad, 1) + ",";
      json += "\"pressure\":" + String(presion, 1) + ","; 
      json += "\"timestamp\":" + String(tiempoDeMedicion);
      json += "}";

  server.send(200, "application/json", json);
}

void manejarDatos() {
  float temperatura = obtenerTemperatura();
  float humedad = obtenerHumedad();
  float presion = obtenerPresion();
  unsigned long tiempoDeMedicion = obtenerTimestamp();

  if (WiFi.status() != WL_CONNECTED) {
    agregarAlBuffer(
      temperatura, 
      humedad, 
      presion, 
      tiempoDeMedicion
    );
  } else {
    if ( cantidadDatos == 0 ) {
      enviarDatos( 
        temperatura,
        humedad,
        presion,
        tiempoDeMedicion
      );
    }

    for (int i = 0; i < cantidadDatos; i++) {
      int indice = (indiceInicio + i) % TAM_BUFFER;
      Medicion m = buffer[indice];
      enviarDatos ( 
        m.temperatura,
        m.humedad,
        m.presion,
        m.tiempoDeMedicion
      );
    }
    
    cantidadDatos = 0;
    indiceInicio = 0;
  };
}

void iniciarServidorWeb() {
  server.on("/data", HTTP_GET, []() {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    manejarDatos();
  });

  server.onNotFound([]() {
    handleFileRead(server.uri());
  });

  server.begin();
  Serial.println("Servidor web iniciado");
}

void manejarServidorWeb() {
  server.handleClient();
}

#endif
