// checkout.js - đọc danh sách ghế đã chọn, hiển thị form, timer, QR generation
(function(){
  const PRICE_PER_SEAT = 30000; // VND
  const selected = JSON.parse(localStorage.getItem('selectedSeats') || '[]');

  const chosenTitle = document.getElementById('chosenTitle');
  const amountText = document.getElementById('amountText');
  const transferNote = document.getElementById('transferNote');
  const qrImage = document.getElementById('qrImage');
  const timerEl = document.getElementById('timer');
  const bookingForm = document.getElementById('bookingForm');
  const cancelBtn = document.getElementById('cancelBtn');

  // show selected seats
  chosenTitle.textContent = selected.length ? `Vị trí: ${selected.join(' • ')}` : 'Vị trí: —';

  const total = selected.length * PRICE_PER_SEAT;
  amountText.textContent = `Số tiền: ${total.toLocaleString('vi-VN')} VND`;
  transferNote.textContent = `Nội dung chuyển khoản: Tên - Số điện thoại - Mã số ghế`;

  // create QR image: encode payment payload (simple)
  function createPaymentPayload(name, phone){
    const content = `PAY|PHIMX|${name || 'KHACH'}|${phone || '000'}|${selected.join(',') || ''}|${total}`;
    // use qrserver to create image
    return 'https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=' + encodeURIComponent(content);
  }

  // If user already filled name/phone in previous attempts, prefill
  const fullnameInput = document.getElementById('fullname');
  const phoneInput = document.getElementById('phone');
  const emailInput = document.getElementById('email');

  fullnameInput.addEventListener('input', regenQR);
  phoneInput.addEventListener('input', regenQR);

  function regenQR(){
    const url = createPaymentPayload(fullnameInput.value, phoneInput.value);
    qrImage.src = url;
    transferNote.textContent = `Nội dung chuyển khoản: ${fullnameInput.value || 'Tên'} - ${phoneInput.value || 'SĐT'} - ${selected.join(' ')}`;
  }

  // init QR
  regenQR();

  // timer based on reserveExpire (saved when clicked continue)
  const reserveExpire = parseInt(localStorage.getItem('reserveExpire') || '0', 10);
  let remaining = reserveExpire ? Math.max(0, Math.floor((reserveExpire - Date.now())/1000)) : 30*60;
  function tick(){
    if (remaining <= 0){
      timerEl.textContent = '00:00';
      // expired: clear selection
      alert('Thời gian giữ ghế đã hết. Vui lòng chọn lại ghế.');
      localStorage.removeItem('selectedSeats');
      localStorage.removeItem('reserveExpire');
      window.location.href = 'index.html';
      return;
    }
    const mm = String(Math.floor(remaining/60)).padStart(2,'0');
    const ss = String(remaining%60).padStart(2,'0');
    timerEl.textContent = `${mm}:${ss}`;
    remaining--;
  }
  tick();
  const timerInterval = setInterval(tick, 1000);

  cancelBtn.addEventListener('click', ()=>{
    if (confirm('Hủy đặt chỗ và trả ghế?')){
      localStorage.removeItem('selectedSeats');
      localStorage.removeItem('reserveExpire');
      window.location.href = 'index.html';
    }
  });

  bookingForm.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    // simple validation
    if (!fullnameInput.value.trim() || !phoneInput.value.trim()){
      alert('Vui lòng nhập họ tên và số điện thoại.');
      return;
    }

    // giả lập xác nhận: có thể gửi fetch tới server ở đây
    // Hiện tại: hiển thị màn hình thành công, xoá localStorage
    alert('Đặt chỗ thành công! Vui lòng thực hiện thanh toán theo mã QR để hoàn tất.');
    localStorage.removeItem('selectedSeats');
    localStorage.removeItem('reserveExpire');
    // redirect về trang chính
    window.location.href = 'index.html';
  });

})();