import apiRequest from "./api";

interface data {
    referenceType?: string;
     referenceId?: string;
     paymentMethod?: string
     amount?: string;
     currency?: string;
}

export async function initiatePayment(data){
    const {referenceType, referenceId, paymentMethod, amount, currency} = data;
  try {
    const res = await apiRequest<any>('/api/initiate/intent/service',{
     method: "POST",
     body: data
    });
    console.log('initiate payment res', res)
    return res;
  }catch(err) {
    throw err;
  }
}