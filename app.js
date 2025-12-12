// app.js - render sơ đồ ghế, xử lý chọn ghế
// Lưu ghế đã chọn vào localStorage key: "selectedSeats"

(function(){
  const ROWS = "ABCDEFGHIJKLMNOPQRSTUV".split('').slice(0,16); // A-P (16 rows)
  const COLS = 22; // số ghế theo hàng
  const leftCols = 11; // chia 2 dãy: 1..11 và 12..22
  const occupiedSample = new Set([
    "A1","A2","B3","C5","D10","E12","F7","G9","H11","J10","K8","L12","M6","N2","P21"
  ]); // mẫu: những ghế đã đặt

  const seatsArea = document.getElementById('seats-area');
  const continueBtn = document.getElementById('continueBtn');

  function loadSelected(){
    const raw = localStorage.getItem('selectedSeats');
    return raw ? JSON.parse(raw) : [];
  }
  function saveSelected(list){
    localStorage.setItem('selectedSeats', JSON.stringify(list));
  }

  let selected = new Set(loadSelected());

  function updateContinueButton(){
    const n = selected.size;
    continueBtn.disabled = n === 0;
    continueBtn.textContent = `Tiếp tục đặt ${n} vé`;
  }

  function toggleSeat(seatId, el){
    if (occupiedSample.has(seatId)) return;
    if (selected.has(seatId)){
      selected.delete(seatId);
      el.classList.remove('selecting');
    }else{
      selected.add(seatId);
      el.classList.add('selecting');
    }
    saveSelected(Array.from(selected));
    updateContinueButton();
  }

  function createSeat(tag){
    const btn = document.createElement('button');
    btn.className = 'seat';
    btn.textContent = tag;
    if (occupiedSample.has(tag)){
      btn.classList.add('occupied');
      btn.disabled = true;
    } else {
      btn.classList.add('available');
      if (selected.has(tag)) btn.classList.add('selecting');
      btn.addEventListener('click', ()=> toggleSeat(tag, btn));
    }
    return btn;
  }

  // render hai cột (left, right) mỗi cột là một div với các hàng
  const leftColumn = document.createElement('div');
  leftColumn.className = 'seat-column';
  const rightColumn = document.createElement('div');
  rightColumn.className = 'seat-column';

  ROWS.forEach(row=>{
    const leftRow = document.createElement('div');
    leftRow.className = 'seat-row';
    const leftLabel = document.createElement('div');
    leftLabel.className = 'row-label';
    leftLabel.textContent = row;
    leftRow.appendChild(leftLabel);

    // left side seats 1..leftCols
    for(let c=1;c<=leftCols;c++){
      const id = row + c;
      leftRow.appendChild(createSeat(id));
    }
    leftColumn.appendChild(leftRow);

    const rightRow = document.createElement('div');
    rightRow.className = 'seat-row';
    const rightLabel = document.createElement('div');
    rightLabel.className = 'row-label';
    // Để cân đối, label bên phải cũng hiển thị hàng
    rightLabel.textContent = row;
    rightRow.appendChild(rightLabel);

    for(let c=leftCols+1;c<=COLS;c++){
      const id = row + c;
      rightRow.appendChild(createSeat(id));
    }
    rightColumn.appendChild(rightRow);
  });

  seatsArea.appendChild(leftColumn);
  // aisle gap
  const aisle = document.createElement('div');
  aisle.className = 'aisle';
  seatsArea.appendChild(aisle);
  seatsArea.appendChild(rightColumn);

  updateContinueButton();

  continueBtn.addEventListener('click', ()=>{
    // chuyển trang đến checkout: trên checkout đọc localStorage['selectedSeats']
    if (selected.size === 0) return;
    // lưu cả thời gian giữ ghế (30 phút) nếu muốn
    const expiresAt = Date.now() + (30*60*1000);
    localStorage.setItem('reserveExpire', expiresAt.toString());
    window.location.href = "checkout.html";
  });

})();