import React, { useState } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";
import { ReceiptItem } from "@/data/receiptTypes";

interface ReceiptTableProps {
  receiptItems: ReceiptItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  onEditItem: (
    id: number,
    updatedItem: Partial<{
      item: string;
      price: number;
      subtotal?: number;
      tax?: number;
      tip?: number;
      total?: number;
    }>
  ) => void;
  onRemoveItem: (id: number) => void;
  onAddNewItem: (newItem: ReceiptItem) => void;
}

export default function ReceiptTable({
  receiptItems,
  tax,
  tip,
  onEditItem,
  onRemoveItem,
  onAddNewItem,
}: ReceiptTableProps) {
  // Local state for new item inputs
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");

  // Calculate subtotal and total
  const subtotal = receiptItems.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal + tax + tip;

  // Function to handle number-only input and dynamically format price
  const handlePriceInput = (value: string): string => {
    const numericValue = value.replace(/\D/g, "");
    if (!numericValue) return "";
    return (parseFloat(numericValue) / 100).toFixed(2);
  };

  const handlePriceChange = (id: number, value: string) => {
    const formattedPrice = handlePriceInput(value);
    if (formattedPrice) {
      onEditItem(id, { price: parseFloat(formattedPrice) });
    }
  };

  const handleAddNewItem = () => {
    if (newItemName.trim() && newItemPrice) {
      const newItem: ReceiptItem = {
        id: Date.now(),
        item: newItemName,
        price: parseFloat(newItemPrice),
        splitters: [],
      };
      onAddNewItem(newItem);
      setNewItemName("");
      setNewItemPrice("");
    }
  };

  return (
    <div className="rounded-lg shadow-lg bg-[#353B47] w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full text-white">
          <thead>
            <tr className="bg-[#1A2535]">
              <th className="py-3 px-2 text-left font-medium text-white"></th>
              <th className="py-3 px-2 text-left font-medium text-white">
                Item
              </th>
              <th className="py-3 px-4 text-right font-medium text-white">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {receiptItems.map((item) => (
              <tr
                key={item.id}
                className="border-t border-gray-600 hover:bg-[#4A4F5C]"
              >
                <td className="py-3 px-2">
                  <button onClick={() => onRemoveItem(item.id)}>
                    <FaTimes className="text-red-500" />
                  </button>
                </td>
                <td className="py-3 px-2">
                  <input
                    type="text"
                    value={item.item}
                    onChange={(e) =>
                      onEditItem(item.id, { item: e.target.value })
                    }
                    className="bg-transparent text-white border-gray-400 focus:outline-none w-full"
                  />
                </td>
                <td className="py-3 px-4 text-right">
                  <input
                    type="text"
                    value={"$" + item.price.toFixed(2)}
                    onChange={(e) => handlePriceChange(item.id, e.target.value)}
                    className="bg-transparent text-white w-full text-right focus:outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="New item name"
          className="bg-transparent text-white border-b border-gray-400 focus:outline-none w-full sm:w-auto"
        />
        <input
          type="text"
          value={newItemPrice}
          onChange={(e) => setNewItemPrice(handlePriceInput(e.target.value))}
          placeholder="Price"
          className="bg-transparent text-white border-b border-gray-400 focus:outline-none w-full sm:w-auto"
        />
        <button onClick={handleAddNewItem}>
          <FaPlus className="text-[#35B2EB]" />
        </button>
      </div>

      <hr className="my-4 border-t border-gray-500" />

      {/* Display Subtotal, Tax, and Total */}
      <div className="px-4 py-2 text-white text-lg text-right">
        <p className="mb-2">Subtotal: ${subtotal.toFixed(2)}</p>
        <p className="mb-2">
          Tax: $
          <span className="inline-block">
            <input
              type="text"
              value={tax.toFixed(2)}
              onChange={(e) =>
                onEditItem(0, {
                  tax: parseFloat(handlePriceInput(e.target.value)) || 0,
                })
              }
              className="bg-transparent text-white border-gray-400 focus:outline-none text-right ml-1 w-16"
            />
          </span>
        </p>
        <p className="mb-2">
          Tip: $
          <span className="inline-block">
            <input
              type="text"
              value={tip.toFixed(2)}
              onChange={(e) =>
                onEditItem(0, {
                  tip: parseFloat(handlePriceInput(e.target.value)) || 0,
                })
              }
              className="bg-transparent text-white border-gray-400 focus:outline-none text-right ml-1 w-16"
            />
          </span>
        </p>

        <p className="font-bold">Total: ${total.toFixed(2)}</p>
      </div>
    </div>
  );
}
