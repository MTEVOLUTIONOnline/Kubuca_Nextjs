const MPESA_URL = "https://mozpayment.co.mz/api/1.1/wf/pagamentorotativompesa"
const EMOLA_URL = "https://mozpayment.co.mz/api/1.1/wf/pagamentorotativoemola"
const CARTEIRA = "1723905069367x355628748456329200"

type PaymentParams = {
  phone: string
  amount: number
  courseId: string
}

export async function fazerPagamentoMpesa({ phone, amount, courseId }: PaymentParams) {
  try {
    const requestBody = {
      carteira: CARTEIRA,
      numero: phone,
      "quem comprou": `Compra do curso ${courseId}`,
      valor: amount.toString()
    }

    const response = await fetch(MPESA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    })

    const responseData = await response.json()

    if (response.ok) {
      if (responseData.success) {
        console.log("Pagamento M-Pesa realizado com sucesso:", responseData)
        return responseData
      } else {
        console.error("Pagamento M-Pesa falhou:", responseData)
        throw new Error(responseData.message || 'Falha no pagamento M-Pesa')
      }
    } else {
      console.error("Erro na requisição M-Pesa:", responseData)
      throw new Error(responseData.message || 'Erro na requisição M-Pesa')
    }
  } catch (error) {
    console.error("Erro ao processar o pagamento M-Pesa:", error)
    throw error
  }
}

export async function fazerPagamentoEmola({ phone, amount, courseId }: PaymentParams) {
  try {
    const requestBody = {
      carteira: CARTEIRA,
      numero: phone,
      "quem comprou": `Compra do curso ${courseId}`,
      valor: amount.toString()
    }

    const response = await fetch(EMOLA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    })

    const responseData = await response.json()

    if (response.ok) {
      if (responseData.success) {
        console.log("Pagamento E-mola realizado com sucesso:", responseData)
        return responseData
      } else {
        console.error("Pagamento E-mola falhou:", responseData)
        throw new Error(responseData.message || 'Falha no pagamento E-mola')
      }
    } else {
      console.error("Erro na requisição E-mola:", responseData)
      throw new Error(responseData.message || 'Erro na requisição E-mola')
    }
  } catch (error) {
    console.error("Erro ao processar o pagamento E-mola:", error)
    throw error
  }
}
