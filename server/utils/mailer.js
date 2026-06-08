const { Resend } = require('resend');

let resend;
function getClient() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

async function sendOrderReceipt({ to, txHash, items, totalEth, shippingAddress }) {
  if (!process.env.RESEND_API_KEY) return;
  const recipient = process.env.RECEIPT_EMAIL || to;

  const itemRows = items
    .map((i) => `<tr>
      <td style="padding:4px 8px">${i.title} — ${i.artist}</td>
      <td style="padding:4px 8px;text-align:right">×${i.qty}</td>
      <td style="padding:4px 8px;text-align:right">${(i.priceEth * i.qty).toFixed(3)} ETH</td>
    </tr>`)
    .join('');

  const addr = shippingAddress
    ? `${shippingAddress.fullName}, ${shippingAddress.address}, ${shippingAddress.city} ${shippingAddress.postalCode}, ${shippingAddress.country}`
    : '—';

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
      <h2 style="color:#c0392b">VinylEth — Order confirmed</h2>
      <p>Thank you for your purchase! Your transaction has been submitted to the Sepolia network.</p>

      <h3>Order summary</h3>
      <table style="width:100%;border-collapse:collapse">
        <thead>
          <tr style="border-bottom:1px solid #ddd">
            <th style="padding:4px 8px;text-align:left">Item</th>
            <th style="padding:4px 8px;text-align:right">Qty</th>
            <th style="padding:4px 8px;text-align:right">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr style="border-top:2px solid #333;font-weight:bold">
            <td colspan="2" style="padding:8px">Total</td>
            <td style="padding:8px;text-align:right">${totalEth.toFixed(3)} ETH</td>
          </tr>
        </tfoot>
      </table>

      <h3>Shipping address</h3>
      <p>${addr}</p>

      <h3>Transaction hash</h3>
      <p style="font-family:monospace;font-size:0.85em;word-break:break-all">
        <a href="https://sepolia.etherscan.io/tx/${txHash}">${txHash}</a>
      </p>

      <hr style="margin-top:32px"/>
      <p style="color:#999;font-size:0.8em">VinylEth — vinyl records on the blockchain</p>
    </div>
  `;

  await getClient().emails.send({
    from: 'VinylEth <onboarding@resend.dev>',
    to: recipient,
    subject: 'Your VinylEth order is confirmed',
    html,
  });
}

module.exports = { sendOrderReceipt };
