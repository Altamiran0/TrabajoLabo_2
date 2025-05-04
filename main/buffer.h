#ifndef BUFFER_H
#define BUFFER_H

#include <ESP8266WiFi.h>

// Estructura para una medición
struct Medicion {
  float temperatura;
  float humedad;
  float presion;
  unsigned long tiempoDeMedicion; 
};

// Buffer circular
const int TAM_BUFFER = 20;
Medicion buffer[TAM_BUFFER];
int indiceInicio = 0;
int cantidadDatos = 0;

// Agregar medición al buffer
void agregarAlBuffer(float temperatura, float humedad, float presion, unsigned long tiempoDeMedicion) {
  int indice = (indiceInicio + cantidadDatos) % TAM_BUFFER;
  buffer[indice] = { temperatura, humedad, presion, tiempoDeMedicion };

  if (cantidadDatos < TAM_BUFFER) cantidadDatos++;
  else indiceInicio = (indiceInicio + 1) % TAM_BUFFER;
}

#endif
