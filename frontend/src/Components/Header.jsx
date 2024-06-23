import React from 'react'
import { CONTACT } from '../constants/content';

function HeadNav({invoiceNum,invoiceDate}) {

  return (
    <div className='flex justify-between'>
        <div>
          <h1 className='text-stone-950 text-4xl my-2 font-serif tracking-wide'>INVOICE</h1>
          <p>Invoice No. : {invoiceNum} </p>
          <p>Invoice Date: {invoiceDate}</p>
        </div>
        <div className=''>
          <h3 className='text-xl font-serif'>Sample Enterprices</h3>
          <div className='text-end '>
            {/* <p>{CONTACT.address.street},</p> */}
            <p className='font-serif'>{CONTACT.address.city},</p>
            <p className='font-serif'>{CONTACT.address.state}</p>
            <p>Phone: {CONTACT.phone}</p>
          </div> 
        </div>
      </div>
  )
}

export default HeadNav