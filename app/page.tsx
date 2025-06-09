'use client';

import { useState } from 'react';

export default function Home() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [list, setList] = useState<{ name: string; price: number; code?: string }[]>([]);

  const API_BASE = process.env.NEXT_PUBLIC_API_ENDPOINT;

  // 商品コード読み込みAPI呼び出し
  const handleRead = async () => {
    if (!code) {
      alert('商品コードを入力してください');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/product/${code}`);
      const data = await res.json();

      if (data && data.PRICE !== undefined) {
        setName(data.NAME);
        setPrice(data.PRICE);
      } else {
        setName('未登録商品');
        setPrice(0);
      }
    } catch (err) {
      console.error('API呼び出し失敗:', err);
      setName('エラー');
      setPrice(0);
    }
  };

  // 購入リストに追加
  const handleAdd = () => {
    if (!name || price === 0 || name === '未登録商品' || name === 'エラー') {
      alert('有効な商品を読み込んでから追加してください');
      return;
    }

    setList([...list, { name, price, code }]);
    setCode('');
    setName('');
    setPrice(0);
  };

  // 購入API呼び出し
  const handlePurchase = async () => {
    if (list.length === 0) {
      alert('購入リストが空です');
      return;
    }

    const purchaseData = {
      emp_cd: "9999999999",
      store_cd: "30",
      pos_no: "90",
      items: list.map(item => ({
        code: item.code || '',
        name: item.name,
        price: item.price,
      })),
    };

    console.log("送信データ:", purchaseData);

    try {
      const res = await fetch(`${API_BASE}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(purchaseData),
      });
      const data = await res.json();
      console.log("購入APIレスポンス:", data);

      if (data.success) {
        alert(`購入成功！合計金額: ${data.total} 円`);
        setList([]);
      } else {
        alert("購入に失敗しました");
      }
    } catch (error) {
      alert("購入処理でエラーが発生しました");
      console.error("購入APIエラー:", error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>POSアプリ</h1>

      <input
        type="text"
        placeholder="商品コード"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={handleRead}>商品コード読み込み</button>

      <div>商品名: {name}</div>
      <div>単価: {price}円</div>

      <button onClick={handleAdd}>追加</button>

      <h2>購入リスト</h2>
      <ul>
        {list.map((item, index) => (
          <li key={index}>
            {item.name} - {item.price}円
          </li>
        ))}
      </ul>

      <button onClick={handlePurchase}>購入</button>
    </div>
  );
}
