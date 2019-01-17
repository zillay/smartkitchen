from tkinter import *
import threading
import time
from utils import (
    make_payload_querystring,
    send_slots_data_to_server,
)

NUM_OF_SLOTS = 6


class Window(Frame):

    def __init__(self, master=None, **kwargs):
        Frame.__init__(self, master, **kwargs)
        self.master = master
        self.master.title('SmartKitchen Mockup Device')
        
        self.slots = {}
        self.is_sending = False

        row = 0

        self.host = StringVar()
        self.host_label = Label(
            self,
            text = "Host : ",
            anchor='e',
            bg='aquamarine'
        )
        self.host_label.grid(
            row=row, 
            column=0, 
            padx=(5, 0), 
            pady=(5, 0),
            ipadx=10,
            ipady=5,
            sticky=NSEW, 
        )

        self.host_entry = Entry(
            self,
            bd=2, 
            width=40,
            bg='lightcyan',
            textvariable=self.host
        )
        self.host_entry.grid(
            row=row, 
            column=1, 
            padx=5, 
            pady=(5, 0),
            ipadx=10,
            ipady=5,
            sticky=NSEW, 
        )
        row += 1
        
        self.port = StringVar()
        self.port_label = Label(
            self,
            text = "Port : ",
            anchor='e',
            bg='aquamarine'
        )
        self.port_label.grid(
            row=row, 
            column=0, 
            padx=(5, 0), 
            pady=(5, 0),
            ipadx=10,
            ipady=5,
            sticky=NSEW, 
        )

        self.port_entry = Entry(
            self,
            bd=2, 
            width=40,
            bg='lightcyan',
            textvariable=self.port
        )
        self.port_entry.grid(
            row=row, 
            column=1, 
            padx=5, 
            pady=(5, 0),
            ipadx=10,
            ipady=5,
            sticky=NSEW, 
        )
        row += 1
        
        self.device_puid = StringVar()
        self.device_puid_label = Label(
            self,
            text = "Device ID : ",
            anchor='e',
            bg='peachpuff'
        )
        self.device_puid_label.grid(
            row=row, 
            column=0, 
            padx=(5, 0), 
            pady=(5, 0),
            ipadx=10,
            ipady=5,
            sticky=NSEW, 
        )

        self.device_puid_entry = Entry(
            self,
            bd=2, 
            width=40,
            bg='lightcyan',
            textvariable=self.device_puid
        )
        self.device_puid_entry.grid(
            row=row, 
            column=1, 
            padx=5, 
            pady=(5, 0),
            ipadx=10,
            ipady=5,
            sticky=NSEW, 
        )
        row += 1

        for slot in range(NUM_OF_SLOTS):
            self.slots[str(slot+1)] = {}
            self.slots[str(slot+1)]['value'] = DoubleVar()
            
            self.slots[str(slot+1)]['label'] = Label(
                self,
                text = "Slot " + str(slot+1) + " : ",
                anchor='e',
                bg='lemonchiffon'
            )
            self.slots[str(slot+1)]['label'].grid(
                row=row, 
                column=0, 
                padx=(5, 0), 
                pady=(5, 0),
                ipadx=10,
                ipady=5,
                sticky=NSEW, 
            )
            
            self.slots[str(slot+1)]['entry'] = Entry(
                self,
                bd=2, 
                width=40,
                bg='lightcyan',
                textvariable=self.slots[str(slot+1)]['value']
            )
            self.slots[str(slot+1)]['entry'].grid(
                row=row, 
                column=1, 
                padx=5, 
                pady=(5, 0),
                ipadx=10,
                ipady=5,
                sticky=NSEW, 
            )
            row += 1
        
        self.send_btn = Button(
            self,
            text="Start Sending", 
            bd=2,
            bg='palegreen',
            fg='black',
            font=('', 10, 'bold'),
            relief='groove',
            command=self.start_sending
        )
        self.send_btn.grid(
            row=row, 
            column=0, 
            columnspan=2, 
            sticky=NSEW, 
            padx=5, 
            pady=(5, 0),
            ipadx=10,
            ipady=5,
        )
        row += 1
        
        self.clear_btn_frame = Frame(self)
        self.clear_btn_frame.grid(row=row, column=0, columnspan=2, sticky=NSEW)

        self.clear_fields_btn = Button(
            self.clear_btn_frame,
            text="Clear Fields", 
            bd=2,
            bg='gainsboro',
            fg='black',
            font=('', 10, 'bold'),
            relief='groove',
            # width=20,
            command=self.clear_fields
        )
        self.clear_fields_btn.grid(
            row=0, 
            column=0, 
            sticky=NSEW, 
            padx=(5, 2),
            pady=(5, 0),
            ipadx=10,
            ipady=5,
        )
        
        self.clear_status_btn = Button(
            self.clear_btn_frame,
            text="Clear Status", 
            bd=2,
            bg='gainsboro',
            fg='black',
            font=('', 10, 'bold'),
            relief='groove',
            command=self.clear_status
        )
        self.clear_status_btn.grid(
            row=0, 
            column=1, 
            sticky=NSEW, 
            padx=(2, 5), 
            pady=(5, 0),
            ipadx=10,
            ipady=5,
        )

        row += 1

        self.status = StringVar()
        self.status.set("- STATUS -")
        self.status_label = Message(
            self,
            anchor='nw',
            bg='white',
            bd=2,
            relief='groove',
            justify='left',
            width=300,
            textvariable=self.status
        )
        self.status_label.grid(
            row=row, 
            column=0, 
            columnspan=2, 
            sticky=NSEW, 
            padx=5, 
            pady=(5, 5),
            ipadx=10,
            ipady=5,
        )
        row += 1


        # for i in range(row+1):
        #     Grid.rowconfigure(self, i, weight=1)
        Grid.rowconfigure(self, row-1, weight=1)
        Grid.columnconfigure(self, 0, weight=1)
        Grid.columnconfigure(self, 1, weight=1)

        Grid.rowconfigure(self.clear_btn_frame, 0, weight=1)
        Grid.columnconfigure(self.clear_btn_frame, 0, weight=1)
        Grid.columnconfigure(self.clear_btn_frame, 1, weight=1)

    def start_sending(self):
        print('Started Sending')
        self.is_sending = True
        self.send_btn.configure(
            text='Stop Sending',
            bg='lightcoral',
            command=self.stop_sending
        )
        t = threading.Thread(target=self.send)
        t.daemon = True
        t.start()
    
    def stop_sending(self):
        print('Stopped Sending')
        self.is_sending = False
        self.send_btn.configure(
            text='Start Sending',
            bg='palegreen',
            command=self.start_sending
        )
        t = threading.Thread(target=self.send)
        t.daemon = True
        t.start()

    def send(self):
        while self.is_sending:
            payload = {}
            for key in self.slots:
                payload[key] = {
                    "cw": self.slots[key]['value'].get()
                }
            
            host = self.host.get()
            port = self.port.get()
            device_puid = self.device_puid.get()
            slots_data = make_payload_querystring(payload)

            try:
                r = send_slots_data_to_server(
                    host=host,
                    port=port,
                    device_puid=device_puid,
                    slots_data=slots_data
                )
            except Exception as e:
                self.status.set(e)
                time.sleep(5)
                continue
            
            if r.status_code != 200:
                self.status.set(r.json()['status']['msg'])
                time.sleep(5)
                continue
            
            # print(r.url)
            # print(r.status_code)
            # print(r.text)
            print(r.json()['status']['msg'])
            self.status.set(r.json()['status']['msg'])
            time.sleep(5)
        
    def clear_fields(self):
        self.host.set('')
        self.port.set('')
        self.device_puid.set('')
        for key in self.slots:
            self.slots[key]['value'].set(0.0)
    
    def clear_status(self):
        self.status.set("- STATUS -")


if __name__ == '__main__':
    root = Tk()
    app = Window(root)
    app.pack(in_=root, fill=BOTH, expand=True)
    root.mainloop()
