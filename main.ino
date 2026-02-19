#include <Wire.h>
#include "SHT2x.h"

HTU21 sht;

const int VOLT_PIN = 32;
const int TOUCH_PIN = 4;

void setup() {
  Serial.begin(115200);

  Wire.begin();

  sht.begin();

  Serial.println("--- Booting ESP32 Telemetry ---");
}

void loop() {
  sht.read();
  float t = sht.getTemperature();
  float h = sht.getHumidity();

  int rawTouch = touchRead(TOUCH_PIN);
  int touchActive = (rawTouch < 800) ? 1 : 0;

  uint32_t mv = analogReadMilliVolts(VOLT_PIN);
  float voltage = mv / 1000.0;

  Serial.print(t); Serial.print(",");
  Serial.print(h); Serial.print(",");
  Serial.print(voltage); Serial.print(",");
  Serial.println(touchActive);

  delay(500);
}
