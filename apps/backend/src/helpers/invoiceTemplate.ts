export default `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice</title>
  <style>
    body {
      font-family: "Open Sans", sans-serif;
      font-size: 12px;
      color: #000;
      margin: 0;
      max-width: 800px;
      margin: auto;
      background-color: #f9f9f9;
    }

    .a4-container {
      position: relative;
      width: 100%;
      padding-top: 141.42%; /* 1:1.414 aspect ratio */
      background-color: white;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .a4-content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    h1,
    h2,
    h3,
    h4 {
      font-family: "Space Mono", monospace;
      margin: 0;
      color: #000;
    }

    p {
      color: #3b3b3b;
      margin: 0;
    }

    h1 {
      color: #000;
      font-size: 42px;
      font-weight: bold;
      text-align: right;
    }

    .bold {
      font-weight: bold;
    }

    .flex {
      display: flex;
    }

    .document-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header {
      display: flex;
      justify-content: space-between;
    }

    .divider {
      width: 100%;
      border-bottom: 1px solid #3b3b3b;
      margin-top: 8px;
      margin-bottom: 18px;
    }

    .invoice-info,
    .billing-info {
      flex: 1;
    }

    .intro-table-title {
      font-weight: bold;
      color: #3b3b3b;
      text-transform: uppercase;
      font-size: 12px;
    }

    .intro-table-title span {
      font-weight: 500;
    }

    .table {
      width: 100%;
      margin-top: 20px;
      border-collapse: collapse;
    }

    .table th {
      background-color: {{from.brandColor}};
      color: white;
      font-weight: bold;
      padding: 8px;
      letter-spacing: 1px;
    }

    .table td {
      padding: 8px;
      border-bottom: 1px solid #ddd;
      background-color: #f3f1fa;
    }

    .table .even {
      background-color: {{from.brandColorLight}};
    }

    .text-right {
      text-align: right;
    }

    .table td:last-child,
    .table th:last-child {
      text-align: right;
    }

    .summary-container {
      margin-top: 18px;
      display: flex;
    }

    .summary {
      display: flex;
      flex: 0 0 auto;
      margin-left: auto;
      padding: 8px;
      background-color: {{from.brandColorLight}};
    }

    .summary-left {
      text-align: left;
      margin-right: 36px;
    }

    .summary-right {
      text-align: right;
    }

    .summary .total {
      font-weight: bold;
      font-size: 16px;
      margin-top: 4px;
    }

    .payment-details {
    margin-top: 18px;
    }

    .cards {
      margin: 8px;
      display: flex;
      align-items: center;
    }

    .payment-method {
      width: 28px;
      margin-right: 10px;
    }

    .button {
      text-transform: uppercase;
      display: inline-block;
      padding: 12px 14px;
      background-color: #23dbb0;
      color: #fff;
      text-decoration: none;
      border-radius: 12px;
      margin-top: 10px;
      font-weight: bold;
      text-align: center;
      cursor: pointer;
      font-size: 14px;
    }

    .bank-details {
      margin-top: 18px;
    }

    .note {
      margin-top: 20px;
      font-size: 12px;
    }

    @media (max-width: 576px) {
  html {
    font-size: 10px;
  }
}
  </style>
</head>

<body>
<div class="a4-container">
  <div class="a4-content">
    <div class="invoice-content">
    <div class="document-header">
      <div class="invoice-info">
        <p class="intro-table-title"><span>#</span> {{task.reference}}</p>
        <p class="intro-table-title"><span>DUE</span> {{task.dueAt}}</p>
      </div>
      <div class="invoice-title">
        <h1>TAX INVOICE</h1>
      </div>
    </div>

    <div class="divider"></div>

    <div class="header">
      <div class="billing-info">
        <p class="intro-table-title">INVOICE TO</p>
        <p>{{to.name}}<br>
        {{#if to.taxNumber}}<span>abn {{to.taxNumber}}<br></span>{{/if}}
        {{to.address}}</p>
      </div>
      <div class="billing-info">
        <p class="intro-table-title text-right">INVOICE FROM</p>
        <p class="text-right">{{from.name}}<br>abn {{from.taxNumber}}<br>{{from.address}}<br>{{from.contact.email}}<br>{{from.website}}</p>
      </div>
    </div>

    <table class="table">
      <tr class="heading">
        <th>DESCRIPTION</th>
        <th>UNIT PRICE</th>
        <th>QTY</th>
        <th>GST</th>
        <th>AMOUNT</th>
      </tr>
      {{#each lineItem}}
      <tr class="{{#if (isEven @index)}}even{{/if}}">
        <td>{{description}}</td>
        <td class="text-right">{{unitPrice}}</td>
        <td class="text-right">{{qty}}</td>
        <td class="text-right">{{gst}}</td>
        <td class="text-right">{{amount}}</td>
      </tr>
      {{/each}}
    </table>


    <div class="summary-container">
      <div class="summary">
        <div class="summary-left">
          <p>Subtotal:</p>
          <p>GST (10%):</p>
          <p class="total">TOTAL</p>
        </div>
        <div class="summary-right">
          <p>{{subTotal}}</p>
          <p>{{totalGST}}</p>
          <p class="total">AUD{{total}}</p>
        </div>
      </div>
    </div>
  </div>
  <div class="footer">
    <div class="payment-details">
      <p><strong>PAYMENT DETAILS</strong></p>
      <div class="cards">
        <img src="visa.png" alt="Visa" class="payment-method" />
        <img src="mastercard.png" alt="Mastercard" class="payment-method" />
        <img src="amex.png" alt="Amex" class="payment-method" />
      </div>
      <div class="button">View and Pay Online</div>
      <div class="bank-details">
        <p>Name: <span class="bold">{{receivingAccount.accountName}}</span></p>
        <p>BSB: <span class="bold">{{receivingAccount.routingNumber}}</span></p>
        <p>Account Number: <span class="bold">{{receivingAccount.number}}</span></p>
        <p>Reference: <span class="bold">{{task.reference}}</span></p>
      </div>
    </div>

    {{#if task.notes}}
    <div class="note">
      <p><strong>NOTES</strong><br>{{task.notes}}</p>
    </div>
    {{/if}}
    </div>
    </div>
  </div>
</body>
</html>`;
