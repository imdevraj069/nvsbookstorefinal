"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import axios from "axios";

const cardOptions = [
  { id: "aadhaar", name: "Aadhaar Card" },
  { id: "pan", name: "PAN Card" },
  { id: "driving", name: "Driving License" },
  { id: "voter", name: "Voter ID" },
  { id: "rc", name: "RC (Vehicle)" },
  { id: "ayushman", name: "Ayushman Card" },
];

const defaultFields = {
  aadhaar: ["fullName", "aadhaarNumber", "mobile"],
  pan: ["fullName", "panNumber", "dob", "mobile"],
  driving: ["fullName", "dlNumber", "state", "mobile"],
  voter: ["fullName", "voterId", "state", "mobile"],
  rc: ["fullName", "rcNumber", "vehicleNumber", "mobile"],
  ayushman: ["fullName", "abhaOrAadhaar", "mobile"],
};

export default function PVCMultiStepForm() {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectCard = (id) => {
    setSelection((prev) =>
      prev.some((s) => s.id === id)
        ? prev.filter((s) => s.id !== id)
        : [...prev, { id, peopleCount: 1 }]
    );
  };

  const handleFieldChange = (cardId, personIdx, key, value) => {
    setFormData((prev) => {
      const cardEntries = prev[cardId] || [];
      const updated = [...cardEntries];
      if (!updated[personIdx]) updated[personIdx] = { copies: 1 };
      updated[personIdx][key] = value;
      return { ...prev, [cardId]: updated };
    });
  };

  const handleCopiesChange = (cardId, personIdx, value) => {
    setFormData((prev) => {
      const cardEntries = prev[cardId] || [];
      const updated = [...cardEntries];
      if (!updated[personIdx]) updated[personIdx] = {};
      updated[personIdx].copies = parseInt(value) || 1;
      return { ...prev, [cardId]: updated };
    });
  };

  const handleSubmitStep1 = () => {
    if (selection.length === 0) return toast.error("Select at least one card");
    const structured = {};
    selection.forEach(({ id, peopleCount }) => {
      structured[id] = Array.from({ length: peopleCount }, () => ({
        copies: 1,
      }));
    });
    setFormData(structured);
    setStep(2);
  };

  const handleSubmitFinal = async () => {
    const items = [];
    for (let card of selection) {
      const entries = formData[card.id] || [];
      for (let entry of entries) {
        if (!entry.mobile) return toast.error("Mobile number is required");
        items.push({
          productType: card.id,
          copies: entry.copies || 1,
          details: entry,
        });
      }
    }

    setIsLoading(true);
    try {
      const res = await axios.post("/api/pvc-order", {
        items,
        paymentMethod: "cod",
      });
      toast.success("Order submitted successfully!");
      setStep(1);
      setFormData({});
      setSelection([]);
    } catch (err) {
      toast.error("Order submission failed");
    } finally {
      setIsLoading(false);
    }
  };

  const grandTotal = Object.values(formData)
    .flat()
    .reduce((acc, entry) => acc + (entry.copies || 1) * 50, 0);

  return (
    <div className="min-h-screen flex items-center justify-center pt-6">
      <div className="max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-2xl shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">
          PVC Card Printing Service
        </h1>

        {step === 1 && (
          <>
            <h2 className="font-medium text-lg">
              Step 1: Select Cards & Order Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cardOptions.map((card) => {
                const selected = selection.find((s) => s.id === card.id);
                return (
                  <div
                    key={card.id}
                    onClick={() => handleSelectCard(card.id)}
                    className={`cursor-pointer border p-4 rounded-xl space-y-2 shadow-sm transition-all flex flex-col gap-2 ${
                      selected
                        ? "border-green-600 bg-green-50"
                        : "border-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{card.name}</span>
                      <span
                        className={`w-5 h-5 inline-block rounded-full border-2 transition ${
                          selected
                            ? "bg-green-600 border-green-600"
                            : "border-gray-400"
                        }`}
                      />
                    </div>
                    {selected && (
                      <div>
                        <Label>Number of People</Label>
                        <Input
                          type="number"
                          min={1}
                          value={selected.peopleCount}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            const peopleCount = parseInt(e.target.value);
                            setSelection((prev) =>
                              prev.map((s) =>
                                s.id === card.id ? { ...s, peopleCount } : s
                              )
                            );
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <Button
              onClick={handleSubmitStep1}
              className="mt-6 w-full rounded-xl"
            >
              Continue
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-medium text-lg">Step 2: Enter Details</h2>
            {selection.map((card) => (
              <div
                key={card.id}
                className="border border-gray-300 p-4 rounded-xl mb-6 bg-muted/20"
              >
                <h3 className="font-semibold text-lg mb-2">
                  {cardOptions.find((c) => c.id === card.id)?.name}
                </h3>
                {Array.from({ length: card.peopleCount }).map(
                  (_, personIdx) => (
                    <div
                      key={personIdx}
                      className="bg-white p-4 rounded-lg mb-4 shadow-sm"
                    >
                      <p className="text-sm font-medium mb-3">
                        Person {personIdx + 1}
                      </p>

                      <Label className="text-sm font-semibold text-gray-700">
                        Copies (₹50 each)
                      </Label>
                      <Input
                        type="number"
                        min={1}
                        className="mb-4"
                        value={formData[card.id]?.[personIdx]?.copies || 1}
                        onChange={(e) =>
                          handleCopiesChange(card.id, personIdx, e.target.value)
                        }
                      />

                      {defaultFields[card.id].map((field) => (
                        <div key={field} className="mb-2">
                          <Label className="capitalize">
                            {field === "mobile" ? (
                              <span>
                                Mobile Number{" "}
                                <span className="text-red-600">
                                  (linked to card)
                                </span>
                              </span>
                            ) : (
                              field.replace(/([A-Z])/g, " $1")
                            )}
                          </Label>
                          <Input
                            placeholder={`Enter ${field}`}
                            value={
                              formData[card.id]?.[personIdx]?.[field] || ""
                            }
                            onChange={(e) =>
                              handleFieldChange(
                                card.id,
                                personIdx,
                                field,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            ))}

            <div className="flex justify-between items-center text-lg font-semibold px-2 py-4 bg-green-100 rounded-lg">
              <span>Total: </span>
              <span className="text-green-700">₹{grandTotal}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto"
              >
                ⬅️ Back
              </Button>
              <Button
                onClick={handleSubmitFinal}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Order"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}