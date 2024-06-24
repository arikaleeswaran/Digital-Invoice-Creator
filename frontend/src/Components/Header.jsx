import React from 'react'
import { CONTACT } from '../constants/content';

function HeadNav({invoiceNum,invoiceDate}) {

  return (
    <div className='flex md:text-base justify-between'>
        <div className='mb-4 md:mb-0'>
          <h1 className='text-stone-950 text-4xl my-2 font-serif tracking-wide'>INVOICE</h1>
          <p>Invoice No. : {invoiceNum} </p>
          <p>Invoice Date: {invoiceDate}</p>
        </div>
        <div className='text-left md:text'>
          <h3 className='text-2xl font-serif'>Sample Enterprices</h3>
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