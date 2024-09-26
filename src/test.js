const ByteArray = require('./bytearray');

var byteArray = new ByteArray();
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

byteArray.position(2);
console.log(byteArray.readInt16()); 
byteArray.offset(4);
console.log(byteArray.readFloat32()); 
byteArray.offset(-8);
console.log(byteArray.readInt32()); 

byteArray.clearAll();