import {
    JsonSerializer, Serializer
} from 'rsocket-core';

export const JsonMetadataSerializer : Serializer<Metadata> = {

    deserialize(data) {
        let json = JsonSerializer.deserialize(data);
        return new Metadata(json);
    },

    serialize(metadata) {
        if (metadata == null) {
            return "";
        }
        

        let json = metadata.toJSON();
        return JsonSerializer.serialize(json);
    }


};


export class Metadata extends Map {

    constructor(json) {
        super();
        if (json != null) {
            for (let [key, value] of Object.entries(json)) {
                this.set(key, value);
            }
        }
    }

    toJSON() {
        const result = {};
        for (let [key, value] of this.entries()) {
            result[key] = value;
        }
        return result;
    }

}
