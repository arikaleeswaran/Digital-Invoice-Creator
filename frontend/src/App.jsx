import React, { useEffect, useRef, useState } from 'react'
import{v4 as uuidv4} from 'uuid';
import Modal from 'react-modal';
import HeadNav from './Components/Header';
import Customer from './Components/Customer';
import { useReactToPrint } from 'react-to-print';
import InvoicePrint from './InvoicePrint';



Modal.setAppElement('#root');

function App() {

  const[invoiceNum,setInvoiceNum] = useState();
  const[custId,setCustID] = useState("");
  const [customData,setCustomData] = useState({
    CustId:custId,
    CustName:"",
    CustEmail:"",
    CustPhone:"",
    CustAddress:"",
  })
  const[btnVisible,setBtnVisible] = useState(true);
  const[amount,setAmount] = useState();
  const[tax,setTax] = useState();
  const[total,SetTotal] = useState();
  const[curItmNo,setCurItmNo] = useState("")
  const[formData,setFormData] = useState({
    Item_id:"",
    ItemName:"",
    Quantity:0,
    Rate:0,
    Amount:0,
    GST:0,
    Total:0,
  })
  const[invoiceItem,setInvoiceItem] = useState([]);
  const[editingItem,setEditingItem] = useState(null);
  const[showModel,setShowModel] = useState(false)
  const[overallAmount,setOverallAmount] =useState(0);
  const[overallGST,setOverallGST] = useState(0);
  const[overallTotal,setOverallTotal] = useState(0);
  const[generatePdf,setGeneratePdf] = useState(false);
  
  //Invoice-Date Generate
  const today = new Date();
  const invoiceDate = today.toLocaleDateString();

  //Invoice Number Generate
  const fetchInvoiceNumber = async ()=>{
    try{
    const response = await fetch("https://invoicebackend.vercel.app/generate-invoice-number");
    if(!response.ok){
      throw new Error("failed to fetch data");
    }
    const data = await response.json();
    setInvoiceNum(data.InvoiceNumber);
    console.log(data.InvoiceNumber);

    }catch(error){console.log(error);}
    
  }

  //Customer ID Generate
  const generateCustId = ()=>{
    const shortId = uuidv4().slice(0,5);
    setCustID(shortId);
    console.log(shortId);
  }

  //UseEffect to generate invoiceId, Cust ID
  useEffect(()=>{
    fetchInvoiceNumber();
    generateCustId();
  },[])


  // Style for Modal Pop-up
  const customStyle ={
    overlay:{
      backgroundColor:'rgba(0,0,0,0.5)',
      backdropFilter:'blur(1px)'
    },
    content:{
      width:'50%',
      height:'60%',
      margin:'auto',
      backgroundColor:'white',
      borderRadius:'10px',
      padding:'20px 10px',
    }
  }

  //Item-ID generate
  const generateItemNo = ()=>{
    //console.log(itemNo);
    const paddItm = Date.now().toString().slice(-5)
    const id = `IT-${paddItm}`;
    setCurItmNo(id);
    console.log(id);
    return id;

  }

  //add item- handle change
  const handleChange = async(e)=>{
    e.preventDefault();
    setFormData((prevData)=>{
      const updateItem = {
      ...prevData,
      [e.target.name] : e.target.value
      };

    const Amount = parseFloat((updateItem.Quantity * updateItem.Rate).toFixed(2));
    const newGST = parseFloat((Amount*0.18).toFixed(2))
    const newTot = parseFloat((Amount + newGST).toFixed(2))
    setAmount(Amount);
    setTax(newGST);
    SetTotal(newTot);

    setFormData((prevData)=>({
      ...prevData,
        Item_id:curItmNo,
        ItemName:updateItem.ItemName,
        Quantity:updateItem.Quantity,
        Rate:updateItem.Rate,
        Amount:Amount,
        GST:newGST,
        Total:newTot
    }));
   // console.log("formdata-change:",formData,updateItem);
    return updateItem;
    });
  };

  //Add item function
  const handleAdd = async(e)=>{
    e.preventDefault();

   // console.log("Custom-add",customData);
    const newItem = {
      Item_id:formData.Item_id,
      ItemName:formData.ItemName,
      Quantity:formData.Quantity,
      Rate:formData.Rate,
      Amount:formData.Amount,
      GST:formData.GST,
      Total:formData.Total,
      isEditable:false,
      InvoiceNumber:invoiceNum,
      CustomerId:custId
    }

    setInvoiceItem((prevInvoiceItems)=>{
      const addItem = [...prevInvoiceItems,{...newItem,isEditable:true}];
      calculateOverAll(addItem);
      return addItem;
    });
    
    setFormData({
      Item_id: "",
      ItemName: "",
      Quantity: 0,
      Rate: 0,
      Amount: 0,
      GST: 0,
      Total: 0,
    });
    
    // console.log(invoiceItem);
    // console.log(formData);
    setShowModel(false);
  
    try{
      //console.log(item.ItemName);
      console.log(newItem);
      const response = await fetch("https://invoicebackend.vercel.app/products",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(newItem)
      })
      if(!response.ok){
        throw new Error("Failed to Add item!");
      }
      //console.log(item,newItem.InvoiceNumber,newItem.CustomerId);
      setShowModel(false);
    }catch(error){console.log(error);}

    console.log(invoiceItem);
  }

  //HandleEdit - Onchange
  const handleEditClick = async (item)=>{
    //e.preventDefault();
    const editedItem = invoiceItem.find((i)=> i.Item_id === item.Item_id);
    setEditingItem(editedItem);
   // console.log("sdf",editedItem);
    setShowModel(true);
    setFormData({
      Item_id : editedItem.Item_id,
      ItemName : editedItem.ItemName,
      Quantity : editedItem.Quantity,
      Rate : editedItem.Rate,
      Amount : editedItem.Amount,
      GST : editedItem.GST,
      Total : editedItem.Total,
    });
  }

 // Edit-HandleUpdate - Update item
  const handleUpdate = async(e)=>{
    e.preventDefault();

    const updateItems = {
      ...editingItem,
      ...formData,
      Item_id: editingItem.Item_id,
    };

    // console.log("Editing Item :",editingItem);
    // console.log("form Data:",formData);
    // console.log( "zzzzf",updateItems,invoiceItem);

    const updateInvoiceItem = invoiceItem.map((item)=>{
      return item.Item_id === editingItem.Item_id ? updateItems : item;
    })

    //console.log("update:",updateInvoiceItem);
    setInvoiceItem(updateInvoiceItem);
    calculateOverAll(updateInvoiceItem);
    setShowModel(false);
  
    try{

      const id =editingItem.Item_id;
      console.log("put-invoice",invoiceItem[0]);
      console.log("id",id);
      const data = updateItems;
      const response = await fetch(`https://invoicebackend.vercel.app/products/${id}`,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(data)
    })
    
    setEditingItem(null);
    setFormData({
      Item_id:"",
      ItemName:"",
      Quantity:0,
      Rate:0,
      Amount:0,
      GST:0,
      Total:0,
    })
    
  }catch(error){
    console.log(error);

  }
}

//handle-Delete

const handleDelete = async(id)=>{

  const updateinvoiceItems = invoiceItem.filter((item)=> item.Item_id !== id);
  setInvoiceItem(updateinvoiceItems);
  calculateOverAll(updateinvoiceItems);

  try{
    const response = await fetch(`https://invoicebackend.vercel.app/${id}`,{
      method:"DELETE"
    })
    if(!response.ok){
      throw new Error("Failed to delete data!");
    }
  }catch(error){
    console.log(error);
  }
}

const calculateOverAll  = (items)=>{

const totAmount = parseFloat(items.reduce((acc,item)=> acc + item.Amount,0).toFixed(2));
const totalGST = parseFloat(items.reduce((acc,item)=> acc + item.GST,0).toFixed(2));
const totalOverall = parseFloat(items.reduce((acc,item)=> acc + item.Total,0).toFixed(2));

setOverallAmount(totAmount);
setOverallGST(totalGST);
setOverallTotal(totalOverall);

}

const totalUpdate = async (id,overallTotal)=>{

  //const newTot = overallTotal;
  try{
    const response = await fetch(`https://invoicebackend.vercel.app/invoice/${id}`,{
      method:"PUT",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify.stringify({overallTotal})
    })
    if(!response.ok){
      throw new Error("Failed to update total!");
    }
  }catch(error) {
    console.log(error);
  }

}

//Handle Print 
const componentRef = useRef();

const handlePrint = useReactToPrint({
  content: ()=>componentRef.current,
  onBeforePrint: () => console.log("before printing..."),
  onAfterPrint: () => {
    console.log("after printing...");
    window.location.reload();
  },
});

useEffect(()=>{
  if (generatePdf){
    handlePrint();
    totalUpdate(invoiceNum,overallTotal);
    setGeneratePdf(false);
  }
},[generatePdf])


  return (
    <div className='mx-4 my-4 p-4  lg:p-10'>

      <HeadNav invoiceNum={invoiceNum} invoiceDate={invoiceDate}/>
      <Customer customData={customData} setCustomData = {setCustomData} custId={custId} invoiceNum={invoiceNum} invoiceDate={invoiceDate} btnVisible={btnVisible} setBtnVisible={setBtnVisible}/>
        
        <div className=' flex justify-center items-center'>
          <button onClick={()=>{setShowModel(true); generateItemNo() }} className=' w-3/4 border-solid outline-none p-2 my-2 rounded-md bg-gradient-to-tr from-purple-500 via-purple-500 to-violet-500 text-white text-lg'>Add Items</button>
          <Modal isOpen={showModel} onRequestClose={()=>{setShowModel(false); setEditingItem(null)}} style={customStyle}>
            <div>
              <h1 className=' flex justify-center items-center text-2xl font-semibold relative'>{ editingItem ? 'Update Item' : 'Add Items'}</h1>
              <button className='absolute top-2 right-2 rounded-bl-2xl bg-red-500 p-2 text-white' onClick={() => setShowModel(false)}>X</button>
              <div className='flex justify-center'>
                <form className=' flex flex-col items-center' onSubmit={ editingItem ? handleUpdate : handleAdd} >
                  <p className='w-full p-2 m-2 bg-purple-200 outline-none whitespace-nowrap'>Item ID : { editingItem ? editingItem.Item_id : curItmNo}</p>
                  <input type='text' placeholder='Item Name' className='w-full p-2 m-2 bg-purple-200 outline-none' name='ItemName' value={formData.ItemName}  onChange={handleChange}></input>
                  <input type='number' placeholder='Quantity' className='w-full p-2 m-2 bg-purple-200 outline-none' name='Quantity' value={formData.Quantity} onChange={handleChange}></input>
                  <input type='number' placeholder='Rate' className='w-full p-2 m-2 bg-purple-200 outline-none' name='Rate' value={formData.Rate} onChange={handleChange}></input>
                  <div className='flex flex-row justify-start items-start'>
                    <p className='w-full p-2 m-2 bg-purple-200 outline-none whitespace-nowrap'>Amount: {formData.Amount}</p>
                    <p className='w-full p-2 m-2 bg-purple-200 outline-none whitespace-nowrap'>GST: {formData.GST}</p>
                    <p className='w-full p-2 m-2 bg-purple-200 outline-none whitespace-nowrap'>Tot. Amount: {formData.Total}</p>
                  </div>
                  <button className=' w-3/4 m-1 outline-none bg-fuchsia-400 p-2 rounded-md ' type='submit'>{editingItem ? 'Update' : 'Add'}</button>
                </form>
              </div>              
            </div>
            
          </Modal>
        </div>

      {/* Table */}
      <table className='table-auto w-full border-collapse border-b-2 rounded-1xl my-3'>
        <thead className='bg-gradient-to-tr from-violet-600 via-violet-600 to-violet-600 text-white'>
          <tr>
              <th className='px-4 py-2 text-left'>Item ID</th>
              <th className='px-4 py-2 text-left'>Item</th>
              <th className='px-4 py-2 text-center'>Qty</th>
              <th className='px-4 py-2 text-center'>Rate (&#x20B9;)</th>
              <th className='px-4 py-2 text-right'>Amount (&#x20B9;)</th>
              <th className='px-4 py-2 text-right'>GST (&#x20B9;)</th>
              <th className='px-4 py-2 text-right'>Total (&#x20B9;)</th>
              <th className='px-4 py-2 text-center'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoiceItem.map((item)=>(
            <tr key={item.Item_id}>
              <td className='px-4 py-2 text-left'>{item.Item_id}</td>
              <td className='px-4 py-2 text-left'>{item.ItemName}</td>
              <td className='px-4 py-2 text-center'>{item.Quantity}</td>
              <td className='px-4 py-2 text-center'>{item.Rate}</td>
              <td className='px-4 py-2 text-right'>{item.Amount}</td>
              <td className='px-4 py-2 text-right'>{item.GST}</td>
              <td className='px-4 py-2 text-right'>{item.Total}</td>
              <td className='px- py-1 text-center'>
                {item.isEditable && (
                  <>
                  <button className='px-3 py-1 outline-none rounded-xl bg-blue-500 mx-2 my-2 text-white' onClick={()=>{handleEditClick(item)}}>Update</button> 
                  <button className='px-3 py-1 outline-none rounded-xl bg-red-600 mx- my-2 text-white' onClick={()=>{handleDelete(item.Item_id)}} >Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
          
        </tbody>
        <tfoot className='my-7 text-xl'>
          <tr >
            <td className='border px-4 py-2'>Overall Totals</td>
            <td className='border px-4 py-2'></td>
            <td className='border px-4 py-2'></td>
            <td className='border px-4 py-2'></td>
            <td className='border px-4 py-2 text-right text-red-600 font-semibold'>{overallAmount}</td>
            <td className='border px-4 py-2 text-right text-red-600 font-semibold'>{overallGST}</td>
            <td className='border px-4 py-2 text-right text-red-600 font-semibold text-2xl'>{overallTotal}</td>
            <td className='border px-4 py-2'></td>
            
          </tr>
        </tfoot>
      </table>
      
      <div className='justify-center items-center text-center'>
        <button className='w-1/3 md:w-1/6 border-solid outline-none p-2 my-2 rounded-md bg-gradient-to-tr bg-blue-600 text-white text-md whitespace-nowrap' onClick={()=>{setGeneratePdf(true)}} >Generate</button>
      </div>

      <div style={{display:'none'}}>
          {generatePdf &&(
          <div style={{display:'none'}}>
        <InvoicePrint 
        ref={componentRef}
        invoiceNum ={invoiceNum}
        invoiceDate = {invoiceDate}
        custId = {custId}
        invoiceItem = {invoiceItem}
        overallAmount = {overallAmount}
        overallGST ={overallGST}
        overallTotal = {overallTotal}
        customData = {customData}
        setCustomData = {setCustomData}
        btnVisible = {btnVisible}
        setBtnVisible = {setBtnVisible}
       
        />
         {console.log("call",customData)}
      </div> 
          )}
     
      </div>
      
      
    </div>

  )
}

export default App