int irSensor = 12;
int buzzer = 7;

int lastValue = 0;

void setup() {
  Serial.begin(9600);
  pinMode(irSensor, INPUT);
  pinMode(buzzer, OUTPUT);
}

void loop() {
  int value = !digitalRead(irSensor);

  Serial.print("Sensor Value = ");
  Serial.println(value);

  if (value == 1 && lastValue == 0) {
    digitalWrite(buzzer, HIGH);
    delay(200);
    digitalWrite(buzzer, LOW);
  }

  lastValue = value;
  delay(1500);
}
