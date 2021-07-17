
class ResponseData {

    currentMeasurementValue!: string | null;
    currentMeasurementType!: string | null;
    mapPoints: {};
    _72HrPercentageChange!: string | null;
    percentageOfCapacity!: string | null;
    capacity!: string | null; ;
    geoLocation!: {} | null;
    request: {} | null;
    status: number;
    error: string;
    

    constructor() {
        this.currentMeasurementValue = null;
        this.currentMeasurementValue = null;
        this.currentMeasurementType = null;
        this.mapPoints = {};
        this._72HrPercentageChange = null;
        this.percentageOfCapacity = null;
        this.capacity = null;
        this.geoLocation = null;
        this.request = null;
        this.status = 0;
        this.error = "0";
    }



    setData = (key: string, data: any) => {
        let self = this;
        Object.keys(self).map((prop)=>{
            if(prop == key){
                self[prop] = data;
            } 
        });
        
    }
}
export default ResponseData;