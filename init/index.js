const mongoose=require("mongoose");
const initdata=require("./data");
const listing=require("../models/listing");
const mongoose_url="mongodb://127.0.0.1:27017/wanderlust";


main()
.then(()=>{
    console.log("connected to db");
})
.catch(err=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(mongoose_url);
}

const initDb=async ()=>{
    await listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj,owner:'689626d01864a6a7b8995977'}));
    await listing.insertMany(initdata.data);
    console.log("data was initialized");
}
initDb();
