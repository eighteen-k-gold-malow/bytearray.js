class ByteArray {
    constructor(data = null, isLittleEndian = true) {
        this.error = false;
        this._bytes = new Uint8Array();
        this._bytesOrder = isLittleEndian; 
        this._position = 0;
        this.clearAll();

        if (data) {
            this.writeBytes(data);
            this.position(0);
        }
    }

    _innerReset(size) {
        if (size < 0) {
            this.error = true;
            return;
        }
        this.error = false;

        if (this._bytes === null) {
            this._bytes = new Uint8Array(size);
        } else {
            const data = this._bytes.slice();
            this._bytes = new Uint8Array(size);
            this._bytes.set(data);
        }
        this.position(0);
    }

    _innerExtend(size) {
        const newLength = this.position() + size;
        if (this.bytesLength() < newLength) {
            const oldBytes = this._bytes;
            this._bytes = new ArrayBuffer(newLength);
            new Uint8Array(this._bytes).set(new Uint8Array(oldBytes));
        }
    }

    clearAll() {
        this._innerReset(0);
    }

    bytesLength(size) {
        return size === undefined ? this._bytes.byteLength : this._innerReset(size);
    }

    position(newPos) {
        if (newPos === undefined) {
            return this._position || 0;
        }
        if (newPos > this.bytesLength()) {
            this.error = true;
            newPos = this.bytesLength();
        }
        if (newPos < 0) {
            this.error = true;
            newPos = 0;
        } else {
            this.error = false;
        }
        this._position = newPos;
        return this._position;
    }

    offset(offset) {
        this.error = false;
        if (this.position() + offset > this.bytesLength()) {
            this.position(this.bytesLength());
            this.error = true;
            return this.position();
        } else if (this.position() + offset < 0) {
            this.position(0);
            this.error = true;
            return this.position();
        } else {
            return this.position(this.position() + offset);
        }
    }

    availableSize() {
        return this.bytesLength() - this.position();
    }

    setBigEndian() {
        this._bytesOrder = false;
    }

    setLittleEndian() {
        this._bytesOrder = true; 
    }

    isBigEndian() {
        return !this._bytesOrder;
    }

    isLittleEndian() {
        return this._bytesOrder;
    }

    bytes() {
        return new Uint8Array(this._bytes);
    }

    writeBool(value) {
        return this.writeInt8(value ? 1 : 0);
    }

    writeInt8(value) {
        this._innerExtend(1);
        new DataView(this._bytes).setInt8(this.position(), value);
        return this.position(this.position() + 1);
    }

    writeInt16(value) {
        this._innerExtend(2);
        new DataView(this._bytes).setInt16(this.position(), value, this._bytesOrder);
        return this.position(this.position() + 2);
    }

    writeInt32(value) {
        this._innerExtend(4);
        new DataView(this._bytes).setInt32(this.position(), value, this._bytesOrder);
        return this.position(this.position() + 4);
    }

    writeInt64(value) {
        this._innerExtend(8);
        new DataView(this._bytes).setBigInt64(this.position(), BigInt(value), this._bytesOrder);
        return this.position(this.position() + 8);
    }

    writeFloat32(value) {
        this._innerExtend(4);
        new DataView(this._bytes).setFloat32(this.position(), value, this._bytesOrder);
        return this.position(this.position() + 4);
    }

    writeFloat64(value) {
        this._innerExtend(8);
        new DataView(this._bytes).setFloat64(this.position(), value, this._bytesOrder);
        return this.position(this.position() + 8);
    }

    writeBytes(value, size) {
        size = size === undefined ? value.length : size; 
        this._innerExtend(size);
        const pos = this.position();
        new Uint8Array(this._bytes).set(value.subarray(0, size), pos);
        return this.position(pos + size);
    }

    writeString(value, size) {
        const bytes = new TextEncoder().encode(value);
        this.writeBytes(bytes, size);
        if(size === undefined) { 
            this.writeInt8(0);
        }
        return this.position();
    }

    writeUTFString(value, size) {
        const buf = new ByteArray(null, this.isLittleEndian());
        buf.writeString(value);
        const lengthToWrite = size !== undefined ? size : buf.bytesLength() - 1;
        this.writeInt16(lengthToWrite);
        return this.writeBytes(buf.bytes(), lengthToWrite);
    }

    readBool() {
        try {
            return this.readInt8() === 1;
        } catch (e) {
            this.error = true;
            return 0;
        }
    }

    readInt8() {
        try {
            this.error = false;
            const value = new DataView(this._bytes).getInt8(this.position());
            this.position(this.position() + 1);
            return value;
        } catch (e) {
            this.error = true;
            return 0;
        }
    }

    readInt16() {
        try {
            this.error = false;
            const value = new DataView(this._bytes).getInt16(this.position(), this._bytesOrder);
            this.position(this.position() + 2);
            return value;
        } catch (e) {
            this.error = true;
            return 0;
        }
    }

    readInt32() {
        try {
            this.error = false;
            const value = new DataView(this._bytes).getInt32(this.position(), this._bytesOrder);
            this.position(this.position() + 4);
            return value;
        } catch (e) {
            this.error = true;
            return 0;
        }
    }

    readInt64() {
        try {
            this.error = false;
            const value = new DataView(this._bytes).getBigInt64(this.position(), this._bytesOrder);
            this.position(this.position() + 8);
            return value;
        } catch (e) {
            this.error = true;
            return 0;
        }
    }

    readFloat32() {
        try {
            this.error = false;
            const value = new DataView(this._bytes).getFloat32(this.position(), this._bytesOrder);
            this.position(this.position() + 4);
            return value;
        } catch (e) {
            this.error = true;
            return 0;
        }
    }

    readFloat64() {
        try {
            this.error = false;
            const value = new DataView(this._bytes).getFloat64(this.position(), this._bytesOrder);
            this.position(this.position() + 8);
            return value;
        } catch (e) {
            this.error = true;
            return 0;
        }
    }

    readBytes(size) {
        try {
            this.error = false;
            const value = new Uint8Array(this._bytes, this.position(), size);
            this.position(this.position() + size);
            return value;
        } catch (e) {
            this.error = true;
            return null;
        }
    }

    readString(size) {
        this.error = false;
        var tail = false;
        try {
            if(size == undefined) {
                const view = new DataView(this._bytes);
                size = 0;
                for(var i = this.position(); i < this.bytesLength(); i++) {
                    const value = view.getInt8(i);
                    if(value === 0) {
                        tail = true;
                        break;
                    }
                    size += 1;
                }
                if(!tail) {
                    throw new Error("can't find \x00");
                }
            }
            const bytes = this.readBytes(size);
            if(tail) {
                this.offset(1);
            }
            return bytes != null ? new TextDecoder("utf-8").decode(new Uint8Array(bytes)): null;
        } catch (e) {
            this.error = true;
            return null;
        }
    }

    readUTFString() {
        try {
            return this.readString(this.readInt16() & 0xffff);
        } catch (e) {
            this.error = true;
            return null;
        }
    }
}

module.exports = ByteArray;
