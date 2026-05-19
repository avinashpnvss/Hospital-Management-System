import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export const ContactUs = () => {
  const [showContactUsModal, setShowContactUsModal] = useState(false);

  return (
    <>
      <button
        className="hover:text-white transition-colors"
        onClick={() => setShowContactUsModal(true)}
      >
        Contact Us
      </button>

      {showContactUsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Contact Us
                  </h2>
                </div>
                <button
                  onClick={() => setShowContactUsModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-200"
                >
                  ×
                </button>
              </div>

              <form className="space-y-6">
                <Input
                  name="name"
                  type="text"
                  label="Name"
                  // value={formData.fatherName || ""}
                  // onChange={handleChange}
                  required
                />

                <Input
                  name="email"
                  type="email"
                  label="Email Address"
                  // value={formData.email}
                  // onChange={handleChange}
                  required
                />

                <Input
                  name="mobile"
                  type="tel"
                  label="Mobile Number"
                  // value={formData.mobile}
                  // onChange={handleChange}
                  required
                />

                <div className="mb-8">
                  <div className="flex space-x-1 p-1 bg-gray-100 rounded-xl">
                    <Button
                      onClick={() => setShowContactUsModal(false)}
                      className="flex-1 rounded-lg transition-all duration-200"
                    >
                      Submit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowContactUsModal(false)}
                      className="flex-1 rounded-lg transition-all duration-200"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
