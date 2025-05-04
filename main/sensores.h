#ifndef SENSORES_H
#define SENSORES_H

#include <Adafruit_BMP280.h>
Adafruit_BMP280 bmp;

#include <DHT.h>
#include <DHT_U.h>

#define DHT22_pin 12 // DHT22 conectado a pin 12 ~ D6
#define DHTTYPE DHT22

DHT dht(DHT22_pin, DHTTYPE);

//#define MensajeInicial_DHT22 "DHT22 hace brumbrum"

#define Mensaje_BPM280_NoIniciado "BPM280 hace brumbrum"
#define Mensaje_BPM280_Iniciado "BPM280 no hace brumbrum"

void iniciarSensores() {
  dht.begin();

  if ( !bmp.begin( 0x76 ) ) Serial.println( Mensaje_BPM280_Iniciado );
  else Serial.println( Mensaje_BPM280_NoIniciado );

  bmp.setSampling(Adafruit_BMP280::MODE_NORMAL,
                  Adafruit_BMP280::SAMPLING_X2,
                  Adafruit_BMP280::SAMPLING_X16,
                  Adafruit_BMP280::FILTER_X16,
                  Adafruit_BMP280::STANDBY_MS_500);
}

float obtenerTemperatura() {
  float temperatura_DHT = dht.readTemperature(); // Temperatura en grados Celcius del DHT22
  float temperatura_BPM = bmp.readTemperature(); // Temperatura en grados Celcius del BPM280
  return ( temperatura_DHT + temperatura_BPM ) / 2;
}

float obtenerHumedad() {
  return dht.readHumidity(); // Porcentaje de Humedad
}

float obtenerPresion() {
  return bmp.readPressure() / 100.0; // Presion medida en hPa
}

#endif
