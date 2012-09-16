/**
 *  HandsOff
 *  (c) Mikhail Yurasov, 2012
 */

// output pins
#define PIN_SPK 49
#define PIN_LED_R 47
#define PIN_LED_Y 45
#define PIN_LED_G 43
#define PIN_PUMP 46 // NO
#define PIN_BUZZER 48 // NC

// on/off constants
#define ON 1
#define OFF 0

// led constants
#define R PIN_LED_R
#define Y PIN_LED_Y
#define G PIN_LED_G

/**
 * Init
 */
void setup() {
  // init pins
  pinMode(PIN_SPK, OUTPUT);
  pinMode(PIN_LED_G, OUTPUT);
  pinMode(PIN_LED_Y, OUTPUT);
  pinMode(PIN_LED_R, OUTPUT);
  pinMode(PIN_PUMP, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);

  // set fuel pump off
  set_pump(OFF);

  // set buzzer off
  set_buzzer(OFF);
}

/**
 * Wait for something to happen
 */
void loop() {
  test_peripherals();
}

/**
 * Test peripherals
 */
void test_peripherals() {
  set_led(R); delay(1000);
  set_led(Y); delay(1000);
  set_led(G); delay(1000);

  beep();

  set_pump(ON); delay(1000);
  set_pump(OFF);

  set_buzzer(ON); delay(100);
  set_buzzer(OFF); delay(75);
  set_buzzer(ON); delay(100);
  set_buzzer(OFF);

  delay(1000);
}

/**
 * Beep
 */
void beep() {
  tone(PIN_SPK, 1200, 333);
  delay(350);
  tone(PIN_SPK, 1200, 333);
  delay(1000 - 350);
}

/**
 * Switch fuel pump on/off
 */
void set_pump(int state) {
  digitalWrite(PIN_PUMP, state ? HIGH : LOW);
}
/**
 * Switch buzzer on/off
 */
void set_buzzer(int state) {
  digitalWrite(PIN_BUZZER, state ? LOW : HIGH);
}

/**
 * Change led
 */
void set_led(int led) {
  digitalWrite(PIN_LED_R, LOW);
  digitalWrite(PIN_LED_Y, LOW);
  digitalWrite(PIN_LED_G, LOW);

  if (led) {
    digitalWrite(led, HIGH);
  }
}