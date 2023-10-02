import React, { useState } from 'react';
import ClipBoardIcon from '../../../images/icons/ClipBoardIcon';
import CartIcon from '../../../images/icons/CartIcon';

const Tabs = ({ ProductTable, OrderTable }) => {
  const [activeTab, setActiveTab] = useState('product');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="tabs tabs-boxed my-8">
        <div
          className={`tab text-2xl font-semibold tab-lg ${activeTab === 'product' ? 'tab-active' : ''}`}
          onClick={() => handleTabClick('product')}
        >
          <ClipBoardIcon className={"w-7 h-7 mr-3"} /> Product
        </div>
        <div
          className={`tab text-2xl font-semibold tab-lg ${activeTab === 'order' ? 'tab-active' : ''}`}
          onClick={() => handleTabClick('order')}
        >
          <CartIcon className={"w-7 h-7 mr-3"} />Order
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'product' && <ProductTable/>}

        {activeTab === 'order' && <OrderTable/>}
      </div>
    </div>
  );
};

export default Tabs;
