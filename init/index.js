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
    await listing.insertMany(initdata.data);
    console.log("data was initialized");
}
initDb();
