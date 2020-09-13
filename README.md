# Battle Bot Controller 

## Parts For The Build

• <a href="https://www.amazon.com/Raspberry-Model-2019-Quad-Bluetooth/dp/B07TD42S27">1 X Raspberry Pi (model 3 or 4)</a><br>
• <a href="https://www.amazon.com/SanDisk-Class-UHS-I-Memory-SDSDUNC-016G-GN6IN/dp/B0143RTB1E">1 X SD Card</a><br>
• <a href="https://www.amazon.com/Qunqi-2Packs-Controller-Stepper-Arduino/dp/B01M29YK5U">2 X L298N Motor Drivers</a><br>
• <a href="https://hobbyking.com/en_us/540-6527-brushed-motor-90w.html">3 X 12v Brushed DC Motor</a><br>
• <a href="https://www.amazon.com/gp/product/B07RBTVBY3">3s Lipo Battery</a><br>
• <a href="https://www.walmart.com/ip/Onn-Portable-Charger-3350-Mah-Black/817310474">Power Bank</a></br>
• <a href="https://www.amazon.com/XOOL-Assortment-Precise-Beautiful-Printed/dp/B072FKMYMF">24 X 3 M 10mm Bolts</a><br>
• <a href="https://www.amazon.com/Swpeet-Stainless-Assortment-Perfect-Washers/dp/B07VPDZ2KJ">24 X 3 M Lock Nuts</a><br>
• <a href="https://www.shapeways.com/">Access To A 3d Printer</a><br>
<br>








## Installation Instruction<br>
• <a href="https://downloads.raspberrypi.org/raspbian_full_latest"></a>Download Raspbian Disk Image<br>
• Write Image To SD Card With <a href="https://raspberry-projects.com/pi/pi-operating-systems/win32diskimager">Win32 Disk Imager</a><br>
• Insert SD Card In Raspberry Pi And Boot<br>
• Skip The Software Update<br>
• In Terminal:<br>
&nbsp;&nbsp;&nbsp;&nbsp;` sudo apt-get update && sudo apt-get upgrade `<br>
&nbsp;&nbsp;&nbsp;&nbsp;` sudo apt-get install nodejs `<br>
&nbsp;&nbsp;&nbsp;&nbsp;` cd ~/Desktop `<br>
&nbsp;&nbsp;&nbsp;&nbsp;` git clone https://github.com/chillbuilds/bot-controller.git `<br>
&nbsp;&nbsp;&nbsp;&nbsp;` sudo nano /etc/rc.local `<br>
• Add This Line At The Beginning Of The Sheet:<br>
&nbsp;&nbsp;&nbsp;&nbsp;` sudo node /home/pi/Desktop/bot-controller/index.js `<br>
• CTRL + X to close text editor<br>
• Y to save<br>
• Enter To Confirm Save Location<br> 
• Reboot










## Wheel Pinout<br><br>

<img style="position:relative;width:60%;margin-left:20%;" src="./assets/images/pinout-wheels.png">
<br><br>

## Weapon Pinout<br><br>

<img style="position:relative;width:40%;margin-left:30%;" src="./assets/images/pinout-weapon.png">
<br><br>