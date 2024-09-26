const ByteArray = require('./bytearray');

var byteArray = new ByteArray(true);

byteArray.setBigEndian();
byteArray.setLittleEndian();
byteArray.isBigEndian();
byteArray.setLittleEndian();
byteArray.bytesLength();
byteArray.availLength();
byteArray.position(0);
byteArray.offset(0);
byteArray.clear();


byteArray.writeBool(true);
byteArray.writeInt8(10);
byteArray.writeInt16(20);
byteArray.writeInt32(30);
byteArray.writeFloat32(40);
byteArray.writeFloat64(50);
byteArray.writeString("Hello");
byteArray.writeString("World", 6);
byteArray.writeBytes(new Uint8Array([1,2,3,4,5,6]));
byteArray.writeUTFString('byte');
byteArray.writeUTFString('array', 12);

oldPos = byteArray.position();
byteArray.position(0);
byteArray.offset(2);
byteArray.writeInt16(100);
byteArray.offset(-2)
byteArray.offset(-1)
byteArray.writeInt8(90);
byteArray.position(oldPos);

console.log(byteArray.bytes().toString());

byteArray.position(0);
console.log(byteArray.readBool()); 
console.log(byteArray.readInt8()); 
console.log(byteArray.readInt16()); 
console.log(byteArray.readInt32()); 
console.log(byteArray.readFloat32());
console.log(byteArray.readFloat64());
console.log(byteArray.readString());
console.log(byteArray.readString(6));
console.log(byteArray.readBytes(6).toString()); 
console.log(byteArray.readUTFString()); 
console.log(byteArray.readUTFString()); 