#include "wifi.h"
#include "sensores.h"
#include "reloj.h"
#include "webserver.h"

void setup() {
  Serial.begin(19200);
  iniciarWiFi();
  iniciarSensores();
  iniciarReloj(); 
  iniciarServidorWeb();
}

void loop() {
  actualizarReloj();
  manejarServidorWeb();
}
