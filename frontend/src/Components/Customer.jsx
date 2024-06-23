import React, { useState } from 'react'

function Customer({customData,setCustomData,custId,invoiceNum,invoiceDate, btnVisible,setBtnVisible}) {
  const custid = custId;
  const invoiceNumb = invoiceNum;
  const invoicedate = invoiceDate;
    
   const [formData,setFormData] = useState(customData ||{
      CustId:custId,
      CustName:"",
      CustEmail:"",
      CustPhone:"",
      CustAddress:"",
   }); 

    const handleChange = (e)=>{
      setFormData((prevCustomerData)=>({
        ...prevCustomerData,
        CustId:custid,
        [e.target.name]:e.target.value,
      }));
      console.log("CustomerData:", customData);
      console.log("FomrData:", formData);
    }  

    const handleSubmit = async (e)=>{
      e.preventDefault();
      console.log("CustomerData:", customData);
          try{
            
            const reqData = {
              custData : formData,
              invoiceNum : invoiceNumb,
              invoiceDate : invoicedate
            }
            
            setCustomData(formData);

            console.log(reqData);
            
            setBtnVisible(false);
            const response = await fetch("http://localhost:5000/users",{
              method:"POST",
              headers:{"Content-Type":"application/json"},
              body:JSON.stringify(reqData)
            });

            if (!response.ok) {
              throw new Error(`Failed to post data. Status: ${response.status}`);
            }
            console.log(reqData);
    
          }catch(error){console.log(error)}
      }
      
    
    
  return (
    <div className='flex justify-center items-center my-7'>
        <div className='w-full md:w-3/4 my-4 border rounded-2xl p-5 bg-white shadow-[-1px_4px_17px_0px_#1a202c]' >
          <form onSubmit={handleSubmit}>
            <div className='flex justify-between font-semibold text-2xl md:text-2xl py-2'>
              <h2 className=''>Billed To:</h2>
              <span>Cust.ID :<span name='CustId'  className='border-b-2 outline-none border-dashed border-gray-200 bg-transparent w-full'> {custId}</span></span>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 '>
                <div className='text-xl md:text-2xl my-1 flex items-center'>
                    <span className='mr-2 whitespace-nowrap'>Customer Name : </span><input type='text' name='CustName' value={formData.CustName} onChange={handleChange} className=' w-full p-1 bg-gray-100 outline-none rounded-sm text-blue-700'></input>
                </div>
                <div className='text-xl md:text-2xl my-1 flex items-center'>
                    <span className='mr-2 whitespace-nowrap'>Phone No. : </span>
                    <input name='CustPhone' value={formData.CustPhone} onChange={handleChange} className='w-full p-1 bg-gray-100 outline-none rounded-sm text-blue-700'></input>
                </div>  
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                <div className='text-xl md:text-2xl my-1 flex items-center'>
                    <span className='mr-2 whitespace-nowrap'>Email : </span>
                    <input name='CustEmail' value={formData.CustEmail} onChange={handleChange} className='w-full p-1 bg-gray-100 outline-none rounded-sm text-blue-700 ' type='email'></input>
                </div>
                <div className='text-xl md:text-2xl my-1 flex items-center'>
                    <span className='mr-2 whitespace-nowrap'>Address : </span>
                    <input name='CustAddress' value={formData.CustAddress} onChange={handleChange} className='w-full p-1 bg-gray-100 outline-none rounded-sm text-blue-700 ' type='text'></input>
                </div>  
            </div>
            
            <div className='flex justify-center items-center'>
            {btnVisible &&(
              <button className='border-solid outline-none w-1/2 md:w-1/12 p-2 text-center rounded-md bg-violet-400 text-black' type='submit' >Done</button>
            )}
            </div>
          </form>
        </div>
    </div>
    
  )
}

export default Customer