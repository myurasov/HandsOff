/**
 *  HandsOff
 *  (c) Mikhail Yurasov, 2012
 *  @version 1.3
 */

// output pins
#define PIN_SPK 48
#define PIN_LED_R 46
#define PIN_LED_Y 44
#define PIN_LED_G 42
#define PIN_PUMP 49 // NO
#define PIN_BUZZER 47 // NC

// on/off constants
#define ON 1
#define OFF 0

// led mode
#define R PIN_LED_R
#define Y PIN_LED_Y
#define G PIN_LED_G

// device connection status
#define DEVICE_ERROR 0
#define DEVICE_DISCONNECTED 1
#define DEVICE_WAITING 2
#define DEVICE_CONNECTED 3
#define DEVICE_WRONG 4

// serial number of unlocking device
#define KEY_SN "9101600073078b0a25e694ffeb69d656bfbdb869"

 // macroses
#define LOBYTE(x) ((char*)(&(x)))[0]
#define HIBYTE(x) ((char*)(&(x)))[1]

//

#include <Max3421e.h>
#include <Usb.h>
#include <LiquidCrystal.h>
#include "melody.h";

//

MAX3421E Max;
USB Usb;
LiquidCrystal lcd(8, 13, 9, 4, 5, 6, 7);

/**
 * Init
 */
void setup() {

  lcd.clear(); 
  lcd.begin(16, 2);
  lcd.setCursor(0, 0); 
  lcd.noBlink();
  lcd.print("////////////////");
  lcd.setCursor(0, 1);
  lcd.print("////Safe/Key////"); 

  // set buzzer off
  setBuzzer(OFF);
  
  // play welcome melody
  play_rtttl(song);

  // set fuel pump off
  setPump(OFF);

  // init pins
  pinMode(PIN_SPK, OUTPUT);
  pinMode(PIN_LED_G, OUTPUT);
  pinMode(PIN_LED_Y, OUTPUT);
  pinMode(PIN_LED_R, OUTPUT);
  pinMode(PIN_PUMP, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);

  // init USB
  delay(100); // required to stabilize power
  Max.powerOn(); // power on USB controller
  delay(200); // wait for devices

  // open searl port
  // Serial.begin(9600);
}

/**
 * Display status on LCD
 */
void setStatusText(char deviceStatus) {
  static char oldStatus = -1;
  char * text;

  if (deviceStatus == DEVICE_CONNECTED) {
    text = "OK / Connected";
  } else if (deviceStatus == DEVICE_WRONG) {
    text = "Wrong Phone";
  } else if (deviceStatus == DEVICE_DISCONNECTED) {
    text = "Disconnected";
  } else if (deviceStatus == DEVICE_ERROR) {
    text = "Device Error";
  } else if (deviceStatus == DEVICE_WAITING) {
    text = "Waiting";
  } else {
    text = "...";
  }

  if (oldStatus != deviceStatus) {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Status:");
    lcd.setCursor(0, 1);
    lcd.print(text);
    oldStatus = deviceStatus;

    if (deviceStatus == DEVICE_WRONG) {
      buzz();
    }
  }
}

char pumpState = OFF;

/**
 * Wait for something to happen
 */
void loop() {
  char deviceStatus;

  deviceStatus = getDeviceStatus();
  setStatusText(deviceStatus);

  if (pumpState == OFF) {

    if (deviceStatus == DEVICE_CONNECTED) {
      setLed(G);
      pumpState = ON;
    } else if (deviceStatus == DEVICE_WRONG) {
      setLed(Y);
      pumpState = OFF;
    } else if (deviceStatus == DEVICE_DISCONNECTED) {
      setLed(R);
      pumpState = OFF;
    } else if (deviceStatus == DEVICE_ERROR) {
      setLed(OFF);
      pumpState = OFF;
    }
  } else { // pump is ON, the car is probably running
    if (deviceStatus != DEVICE_CONNECTED) {
      long startMsWarning = millis();
      char led = G;

      // check for device
      do {
        // warning
        led = led == G ? R : G;
        setLed(led);
        //beep();
        setBuzzer(ON);
        // buzz();

        long startMsPoll = millis();
        
        do {
          // try to configure and switch on the device
          deviceStatus = getDeviceStatus();
          setStatusText(deviceStatus);
          
          // set buzzer off
          if (millis() - startMsPoll >= 500) {
            setBuzzer(OFF);
          }

          // device is connected back
          if (deviceStatus == DEVICE_CONNECTED) {
            setLed(G);
            setBuzzer(OFF);
            return;
          }

          delay(20);
        } while (millis() - startMsPoll < 1000); // 700 ms

        setBuzzer(OFF);
      } while (millis() - startMsWarning < 15000); // 15 sec

      pumpState = OFF;
    }
  }

  setPump(pumpState);
  delay(333);
}

/**
 * Get device connection status
 */
char getDeviceStatus() {
  Max.Task();
  Usb.Task();

  if (Usb.getUsbTaskState() == USB_STATE_CONFIGURING) {
    Usb.setConf(1, 0, 1);
    Usb.setUsbTaskState(USB_STATE_RUNNING);

    return DEVICE_WAITING;
  } else if (Usb.getUsbTaskState() == USB_STATE_RUNNING) {

    // get descriptior

    USB_DEVICE_DESCRIPTOR buf;
    byte rCode;

    rCode = Usb.getDevDescr(1, 0, 0x12, (char *) &buf);
    
    if (rCode) {
      return DEVICE_ERROR; // can't get device descriptor
    }

    if (buf.iSerialNumber == 0) {
      return DEVICE_WRONG; // device doesn't have a serial number
    }

    // get SN

    char serialNumber[64];
    rCode = getUsbString(1, buf.iSerialNumber, serialNumber);

    if (rCode) {
      return DEVICE_ERROR; // can't read SN
    }

    // compare SN

    if (strcmp(serialNumber, KEY_SN) == 0) {
      return DEVICE_CONNECTED;
    } else {
      return DEVICE_WRONG;
    }
  }

  return DEVICE_DISCONNECTED;
}

/**
 * Test peripherals
 */
void testPeripherals() {
  setLed(R); delay(1000);
  setLed(Y); delay(1000);
  setLed(G); delay(1000);

  beep();

  setPump(ON); delay(1000);
  setPump(OFF);

  setBuzzer(ON); delay(100);
  setBuzzer(OFF); delay(75);
  setBuzzer(ON); delay(100);
  setBuzzer(OFF);

  delay(1000);
}

/**
 * Beep
 */
void beep() {
  tone(PIN_SPK, 1000, 333);
}

/**
 * Buzz
 */
void buzz() {
  setBuzzer(ON);
  delay(500);
  setBuzzer(OFF);
}

/**
 * Switch fuel pump on/off
 */
void setPump(char state) {
  digitalWrite(PIN_PUMP, state ? HIGH : LOW);
}
/**
 * Switch buzzer on/off
 */
void setBuzzer(char state) {
  digitalWrite(PIN_BUZZER, state ? LOW : HIGH);
}

/**
 * Set active LED or turn them off
 */
void setLed(char led) {
  digitalWrite(PIN_LED_R, LOW);
  digitalWrite(PIN_LED_Y, LOW);
  digitalWrite(PIN_LED_G, LOW);

  if (led) {
    digitalWrite(led, HIGH);
  }
}

/**
 * Get string from USB device descriptor
 */
byte getUsbString(byte deviceAddr, byte index, char * sn)
{
  char buf[256];
  
  byte rCode;
  byte length;
  byte i;
  unsigned int langId;

  // get language table length

  rCode = Usb.getStrDescr(deviceAddr, 0, 1, 0, 0, buf);  

  if (rCode) {
    return rCode; // error retrieving LangID table length
  }

  length = buf[0]; // length is the first byte

  // get language table

  rCode = Usb.getStrDescr( deviceAddr, 0, length, 0, 0, buf );

  if (rCode) {
    return rCode; // error retrieving LangID table
  }

  HIBYTE(langId) = buf[3]; // get first langId
  LOBYTE(langId) = buf[2];

  rCode = Usb.getStrDescr(deviceAddr, 0, 1, index, langId, buf);

  if (rCode) {
    return rCode; // error retrieving string length
  }

  length = buf[0];

  // get string

  rCode = Usb.getStrDescr(deviceAddr, 0, length, index, langId, buf);

  if (rCode) {
    return rCode; // error retrieving string
  }

  // resulting string is unicode, so converting it to ascii

  byte sni = 0;

  for (i = 2; i < length; i += 2) {
    sn[sni] = buf[i];
    sni++;
  }

  sn[sni] = 0; // terminate string

  return 0;
}
