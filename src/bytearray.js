class ByteArray {
    constructor(isLittleEndian = true, data = null) {
        this._error = false;
        this._bytes = new ArrayBuffer(0);
        this._bytesOrder = isLittleEndian;
        this._position = 0;

        if (data) {
            this.writeBytes(data);
            this.position(0);
        }
    }

    _innerReset(size) {
        this._error = false;
        if (size < 0) {
            this._error = true;
            return;
        }
        const data = this._bytes.slice(0, this._bytes.byteLength>=size?size:this._bytes.byteLength);
        this._bytes = new ArrayBuffer(size);
        new Uint8Array(this._bytes).set(new Uint8Array(data));
        this.position(0);
    }

    _innerExtend(size) {
        const oldPos = this.position();
        const fillSize = size - this.availLength();
        if (fillSize > 0) {
            this._innerReset(this.bytesLength() + fillSize);
            this.position(oldPos);
        }
    }
    
    hasError() {
        return this._error;
    }

    clear() {
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
            this._error = true;
            newPos = this.bytesLength();
        }
        if (newPos < 0) {
            this._error = true;
            newPos = 0;
        } else {
            this._error = false;
        }
        this._position = newPos;
        return this._position;
    }

    offset(offset) {
        this._error = false;
        if (this.position() + offset > this.bytesLength()) {
            this.position(this.bytesLength());
            this._error = true;
            return this.position();
        } else if (this.position() + offset < 0) {
            this.position(0);
            this._error = true;
            return this.position();
        } else {
            return this.position(this.position() + offset);
        }
    }

    availLength() {
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
        return this.writeInt8(value ? 1 : 0, true);
    }

    writeInt8(value, unsiged) {
        this._innerExtend(1);
        if(unsiged) {
            new DataView(this._bytes).setUint8(this.position(), value);
        } else {
            new DataView(this._bytes).setInt8(this.position(), value);
        }
        return this.position(this.position() + 1);
    }

    writeInt16(value, unsiged) {
        this._innerExtend(2);
        if(unsiged) {
            new DataView(this._bytes).setUint16(this.position(), value, this._bytesOrder);
        } else {
            new DataView(this._bytes).setInt16(this.position(), value, this._bytesOrder);
        }
        return this.position(this.position() + 2);
    }

    writeInt32(value, unsiged) {
        this._innerExtend(4);
        if(unsiged) {
            new DataView(this._bytes).setUint32(this.position(), value, this._bytesOrder);
        } else {
            new DataView(this._bytes).setInt32(this.position(), value, this._bytesOrder);
        }
        return this.position(this.position() + 4);
    }

    writeInt64(value, unsiged) {
        this._innerExtend(8);
        if(unsiged) {
            new DataView(this._bytes).setBigUint64(this.position(), BigInt(value), this._bytesOrder);
        } else {
            new DataView(this._bytes).setBigInt64(this.position(), BigInt(value), this._bytesOrder);
        }
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
        if (size === undefined) {
            this.writeInt8(0, true);
        }
        return this.position();
    }

    writeUTFString(value, size) {
        const buf = new ByteArray(this.isLittleEndian());
        buf.writeString(value);
        const lengthToWrite = size !== undefined ? size : buf.bytesLength() - 1;
        this.writeInt16(lengthToWrite, true);
        return this.writeBytes(buf.bytes(), lengthToWrite);
    }

    readBool() {
        try {
            return this.readInt8(true) === 1;
        } catch (e) {
            this._error = true;
            return null;
        }
    }

    readInt8(unsiged) {
        try {
            this._error = false;
            var value = null;
            if(unsiged) {
                value = new DataView(this._bytes).getUint8(this.position());
            } else {
                value = new DataView(this._bytes).getInt8(this.position());
            }
            this.position(this.position() + 1);
            return value;
        } catch (e) {
            this._error = true;
            return null;
        }
    }

    readInt16(unsiged) {
        try {
            this._error = false;
            var value = null;
            if(unsiged) {
                value = new DataView(this._bytes).getUint16(this.position(), this._bytesOrder);
            } else {
                value = new DataView(this._bytes).getInt16(this.position(), this._bytesOrder);
            }
            this.position(this.position() + 2);
            return value;
        } catch (e) {
            this._error = true;
            return null;
        }
    }

    readInt32(unsiged) {
        try {
            this._error = false;
            var value = null;
            if(unsiged) {
                value = new DataView(this._bytes).getUint32(this.position(), this._bytesOrder);
            } else {
                value = new DataView(this._bytes).getInt32(this.position(), this._bytesOrder);
            }
            this.position(this.position() + 4);
            return value;
        } catch (e) {
            this._error = true;
            return null;
        }
    }

    readInt64(unsiged) {
        try {
            this._error = false;
            var value = null;
            if(unsiged) {
                value = new DataView(this._bytes).getBigUint64(this.position(), this._bytesOrder);
            } else {
                value = new DataView(this._bytes).getBigInt64(this.position(), this._bytesOrder);
            }
            this.position(this.position() + 8);
            return value;
        } catch (e) {
            this._error = true;
            return null;
        }
    }

    readFloat32() {
        try {
            this._error = false;
            const value = new DataView(this._bytes).getFloat32(this.position(), this._bytesOrder);
            this.position(this.position() + 4);
            return value;
        } catch (e) {
            this._error = true;
            return null;
        }
    }

    readFloat64() {
        try {
            this._error = false;
            const value = new DataView(this._bytes).getFloat64(this.position(), this._bytesOrder);
            this.position(this.position() + 8);
            return value;
        } catch (e) {
            this._error = true;
            return null;
        }
    }

    readBytes(size) {
        try {
            this._error = false;
            const value = new Uint8Array(this._bytes, this.position(), size);
            this.position(this.position() + size);
            return value;
        } catch (e) {
            this._error = true;
            return null;
        }
    }

    readString(size) {
        this._error = false;
        var tail = false;
        try {
            if (size == undefined) {
                const view = new DataView(this._bytes);
                size = 0;
                for (var i = this.position(); i < this.bytesLength(); i++) {
                    const value = view.getInt8(i);
                    if (value === 0) {
                        tail = true;
                        break;
                    }
                    size += 1;
                }
                if (!tail) {
                    throw new Error("can't find \x00");
                }
            }
            const bytes = this.readBytes(size);
            if (tail) {
                this.offset(1);
            }
            return bytes != null ? new TextDecoder("utf-8").decode(new Uint8Array(bytes)) : null;
        } catch (e) {
            this._error = true;
            return null;
        }
    }

    readUTFString() {
        try {
            return this.readString(this.readInt16(true));
        } catch (e) {
            this._error = true;
            return null;
        }
    }
}

module.exports = ByteArray;
