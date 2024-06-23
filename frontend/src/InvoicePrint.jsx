import React, { forwardRef } from "react";
import HeadNav from "./Components/Header";
import Customer from "./Components/Customer";

const InvoicePrint = forwardRef((props, ref)=>{
    const data =props;
    //const
    console.log("print-props data",data.invoiceNum,data.invoiceDate,data.custId,data.invoiceItem,data.overallAmount,data.overallGST,data.overallTotal,data.customData,);
    //console.log("print",data.invoiceNum, invoiceDate, custId, invoiceItem, overallAmount, overallGST, overallTotal,customData,setCustomData,btnVisible,setBtnVisible);

    return(

        <div ref={ref} className="print-container mx-2 my-2 p-10">
        <HeadNav invoiceNum={data.invoiceNum} invoiceDate={data.invoiceDate}/>
        <Customer customData={data.customData} setCustomData = {data.setCustomData} custId={ data.custId} invoiceNum={data.invoiceNum} invoiceDate={data.invoiceDate} btnVisible={data.btnVisible} setBtnVisible={data.setBtnVisible} />

        {/* customData={customData} setCustomData = {setCustomData}  btnVisible={btnVisible} setBtnVisible={setBtnVisible(false)} */}

      {/* Table */}
      <table className='table-auto w-full border-collapse border-b-2 rounded-1xl my-3'>
        <thead className='bg-gradient-to-tr from-violet-600 via-violet-600 to-violet-600 text-white'>
          <tr>
              <th className='px-4 py-2 text-left'>Item ID</th>
              <th className='px-4 py-2 text-left'>Item</th>
              <th className='px-4 py-2 text-center'>Qty</th>
              <th className='px-4 py-2 text-center'>Rate (&#x20B9;)</th>
              <th className='px-4 py-2 text-right'>Amount (&#x20B9;) </th>
              <th className='px-4 py-2 text-right'>GST (&#x20B9;)</th>
              <th className='px-4 py-2 text-right'>Total (&#x20B9;)</th>
              {/* <th className='px-4 py-2 text-center'>Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {(data.invoiceItem).map((item)=>(
            <tr key={item.Item_id}>
              <td className='px-4 py-2 text-left'>{item.Item_id}</td>
              <td className='px-4 py-2 text-left'>{item.ItemName}</td>
              <td className='px-4 py-2 text-center'>{item.Quantity}</td>
              <td className='px-4 py-2 text-center'>{item.Rate}</td>
              <td className='px-4 py-2 text-right'>{item.Amount}</td>
              <td className='px-4 py-2 text-right'>{item.GST}</td>
              <td className='px-4 py-2 text-right'>{item.Total}</td>
              {/* <td className='px- py-1 text-center'>
                {item.isEditable && (
                  <>
                  <button className='px-3 py-1 outline-none rounded-xl bg-blue-500 mx-2 my-2 text-white' onClick={()=>{handleEditClick(item)}}>Update</button> 
                  <button className='px-3 py-1 outline-none rounded-xl bg-red-600 mx- my-2 text-white' onClick={()=>{handleDelete(item.Item_id)}} >Delete</button>
                  </>
                )}
              </td> */}
            </tr>
          ))}
          
        </tbody>
        <tfoot className='my-7'>
          <tr >
            <td className='border px-4 py-2'>Overall Totals</td>
            <td className='border px-4 py-2'></td>
            <td className='border px-4 py-2'></td>
            <td className='border px-4 py-2'></td>
            <td className='border px-4 py-2 text-right text-red-600 font-semibold'>{data.overallAmount}</td>
            <td className='border px-4 py-2 text-right text-red-600 font-semibold'>{data.overallGST}</td>
            <td className='border px-4 py-2 text-right text-red-600 font-semibold text-2xl'>{data.overallTotal}</td>
            
          </tr>
        </tfoot>
      </table>
      <div className="flex justify-between mt-4 ">
        <div className="flex flex-col items-start">
          <h1 className="font-semibold italic text-2">PAYMENT DETAILS</h1>
          <p>Bank Name : HDFC Bank</p>
          <p>Branch : Bangalore</p>
          <p>Account Name: ARIKALEESWARAN</p>
          <p>Account No : 1234567890</p>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h1 className="font-semibold italic text-3xl text-center">THANK YOU!</h1>
      </div>
      </div>
      

      </div>
    );
});

export default InvoicePrint;