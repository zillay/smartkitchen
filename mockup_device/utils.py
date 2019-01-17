import json
import urllib.parse
import requests

def make_payload_querystring(payload_dict):
    payload_json = urllib.parse.quote_plus(json.dumps(payload_dict))
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
