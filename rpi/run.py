#! /usr/bin/python2

import time
import sys
import json
import urllib
import requests

def make_payload_querystring(payload_dict):
    payload_json = urllib.quote(json.dumps(payload_dict))
    return payload_json

def send_slots_data_to_server(host, port, device_puid, slots_data):
    r = requests.post(
        ('http://{host}:{port}/item/update' + 
         '?device_puid={device_puid}&slots_data={slots_data}')
        .format(
            host=host, 
            port=port, 
            device_puid=device_puid, 
            slots_data=slots_data
        )
    )
    return r

EMULATE_HX711=False

if not EMULATE_HX711:
    import RPi.GPIO as GPIO
    from hx711 import HX711
else:
    from emulated_hx711 import HX711

def cleanAndExit():
    print "Cleaning..."

    if not EMULATE_HX711:
        GPIO.cleanup()
        
    print "Bye!"
    sys.exit()

hx = HX711(5, 6)

# I've found out that, for some reason, the order of the bytes is not always the same between versions of python, numpy and the hx711 itself.
# Still need to figure out why does it change.
# If you're experiencing super random values, change these values to MSB or LSB until to get more stable values.
# There is some code below to debug and log the order of the bits and the bytes.
# The first parameter is the order in which the bytes are used to build the "long" value.
# The second paramter is the order of the bits inside each byte.
# According to the HX711 Datasheet, the second parameter is MSB so you shouldn't need to modify it.
hx.set_reading_format("MSB", "MSB")

# HOW TO CALCULATE THE REFFERENCE UNIT
# To set the reference unit to 1. Put 1kg on your sensor or anything you have and know exactly how much it weights.
# In this case, 92 is 1 gram because, with 1 as a reference unit I got numbers near 0 without any weight
# and I got numbers around 184000 when I added 2kg. So, according to the rule of thirds:
# If 2000 grams is 184000 then 1000 grams is 184000 / 2000 = 92.
hx.set_reference_unit(1)

hx.reset()
#hx.tare()


# to use both channels, you'll need to tare them both
#hx.tare_A()
#hx.tare_B()

while True:
    try:
        # These three lines are usefull to debug wether to use MSB or LSB in the reading formats
        # for the first parameter of "hx.set_reading_format("LSB", "MSB")".
        # Comment the two lines "val = hx.get_weight(5)" and "print val" and uncomment the three lines to see what it prints.
        if False:
            np_arr8_string = hx.get_np_arr8_string()
            binary_string = hx.get_binary_string()
            print binary_string + " " + np_arr8_string
        
        # Prints the weight. Comment if you're debbuging the MSB and LSB issue.
        # val = hx.get_weight(5)
        val = hx.read_long()
        # print val

        host = "smartkitchen.pythonanywhere.com"
        port = "80"
        device_puid = "d101"
        slots_dict = {"1": {"cw": val}}
        slots_data = make_payload_querystring(slots_dict)
        print slots_dict
        # print slots_data

        try:
            r = send_slots_data_to_server(
                    host=host,
                    port=port,
                    device_puid=device_puid,
                    slots_data=slots_data
                )

            if r.status_code != 200:
                print "Error: \tBad response from server."
                print "HTTP_CODE: \t" + str(r.status_code)
            else:
                print "Success: \t" + r.json()["status"]["msg"]
                print "HTTP_CODE: \t" + str(r.status_code)
            
        except Exception as e:
            print e
            
        print "-------------------------"

        # To get weight from both channels (if you have load cells hooked up 
        # to both channel A and B), do something like this
        #val_A = hx.get_weight_A(5)
        #val_B = hx.get_weight_B(5)
        #print "A: %s  B: %s" % ( val_A, val_B )

        # hx.power_down()
        # hx.power_up()
        hx.reset()
        time.sleep(5)

    except (KeyboardInterrupt, SystemExit):
        cleanAndExit()
