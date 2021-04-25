"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CssFabricHelper {
    constructor(inputFabricObject = {}) {
        this.fabricObject = inputFabricObject;
        this.fabricDebug = {};
        this.fabricTerminate = [];
        this.fabricObjectTags = Object.keys(this.fabricObject);
    }
    // step 1 : loop trough the object
    parseFabricObject() {
        //
        this.fabricObjectTags.forEach((fabricRule) => {
            // serve activeRule in an array for later join
            this.activeFabricTag = [fabricRule];
            this.activeFabricTagValue = this.fabricObject[fabricRule];
            this.parseFabricObjectTag(fabricRule, this.activeFabricTagValue);
        });
    }
    static process(inputFabricObject) {
        const inst = new CssFabricHelper(inputFabricObject);
        // launch parse
        inst.parseFabricObject();
        return inst._finalize();
    }
    parseFabricObjectTag(tagRule, tagValue) {
        //
        this.fabricDebug[this.activeFabricTag] = [];
        //
        const tagValueType = getType(tagValue);
        //
        switch (tagValueType) {
            case "string":
                this._terminate(tagRule, tagValue);
                break;
            case "array":
                for (const tag of tagValue) {
                    if (getType(tag) === "string") {
                        this._terminate(tagRule, tag);
                    }
                    if (getType(tag) === "array") {
                        console.log(tag);
                    }
                    if (getType(tag) === "object") {
                        for (const tagKey in tag) {
                            let propertyValue = tag[tagKey];
                            let newParentKey = tagRule + "-" + tagKey;
                            this.parseFabricObjectTag(newParentKey, propertyValue);
                        }
                    }
                }
                break;
            case "object":
                for (const tagValueKey in tagValue) {
                    let propertyValue = tagValue[tagValueKey];
                    let newParentKey = tagRule + "-" + tagValueKey;
                    this.parseFabricObjectTag(newParentKey, propertyValue);
                }
                break;
            default:
                break;
        }
    }
    _finalize() {
        return this.fabricTerminate.join(" ");
    }
    _terminate(parentKey, val) {
        //
        this.fabricTerminate.push(`${parentKey}-${val}`);
    }
    log(...content) {
        console.log(JSON.stringify(content, undefined, "\t"));
    }
}
const getType = (val) => {
    if (typeof val === "string" || typeof val === "number")
        return "string";
    if (Array.isArray(val))
        return "array";
    if (typeof val === "object")
        return "object";
    return "string";
};
exports.default = { process: CssFabricHelper.process };
