#ifndef RELOJ_H
#define RELOJ_H

#include <NTPClient.h>
#include <WiFiUdp.h>

// UDP y cliente NTP
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 0, 60000);  // UTC-3 y actualiza cada 60 seg

void iniciarReloj() {
  timeClient.begin();
}

void actualizarReloj() {
  timeClient.update();
}

unsigned long obtenerTimestamp() {
  return timeClient.getEpochTime(); // Devuelve epoch en segundos
}

String obtenerHora() {
  return timeClient.getFormattedTime(); // "HH:MM:SS"
}

#endif
