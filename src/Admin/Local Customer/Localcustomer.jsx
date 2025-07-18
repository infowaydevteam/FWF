import React, { useState, useEffect } from "react";
import "../../App.css";
import Sidebar from "../Sidebar/Sidebar";
import { API_BASE_URL } from "../../../Config";
import Logout from "../Logout";

export default function Localcustomer() {
  const [formData, setFormData] = useState({
    customerName: "",
    state: "",
    district: "",
    mobileNumber: "",
    email: "",
    address: "",
    customerType: "Customer",
    agentName: "",
    agentContact: "",
    agentEmail: "",
    agentState: "",
    agentDistrict: "",
    custAgentName: "",
    custAgentContact: "",
    custAgentEmail: "",
    custAgentAddress: "",
    custAgentDistrict: "",
    custAgentState: "",
  });
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/locations/states`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setStates(data);
      if (data.length > 0 && formData.customerType !== "Customer of Selected Agent") {
        setFormData((prev) => ({ ...prev, state: data[0].name }));
        await fetchDistricts(data[0].name);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      setError("Failed to load states. Please ensure the backend is running and the states table exists.");
    }
  };

  const fetchDistricts = async (stateName, isAgent = false) => {
    if (!stateName) {
      setDistricts([]);
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/locations/states/${stateName}/districts`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setDistricts(data);
      if (data.length > 0 && !isAgent) {
        setFormData((prev) => ({ ...prev, district: data[0].name }));
      } else if (data.length > 0 && isAgent) {
        setFormData((prev) => ({ ...prev, agentDistrict: data[0].name }));
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
      setError(`Failed to load districts for ${stateName}. Check backend logs.`);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/directcust/agents`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setAgents(data);
    } catch (error) {
      console.error("Error fetching agents:", error);
      setError("Failed to load agents. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value || "" }));
    setError(null);

    if (name === "state") {
      fetchDistricts(value);
      setFormData((prev) => ({ ...prev, district: "" }));
    } else if (name === "agentState") {
      fetchDistricts(value, true);
      setFormData((prev) => ({ ...prev, agentDistrict: "" }));
    } else if (name === "custAgentState") {
      fetchDistricts(value, true);
      setFormData((prev) => ({ ...prev, custAgentDistrict: "" }));
    } else if (name === "customerType") {
      const newType = value.trim();
      setFormData((prev) => ({ ...prev, customerType: newType }));
      if (newType === "Customer of Selected Agent") {
        fetchAgents();
        setFormData((prev) => ({
          ...prev,
          customerName: "",
          state: "",
          district: "",
          mobileNumber: "",
          email: "",
          address: "123 Main St, Apt 4B",
          agentName: "",
          agentContact: "",
          agentEmail: "",
          agentState: "",
          agentDistrict: "",
          custAgentName: "",
          custAgentContact: "",
          custAgentEmail: "",
          custAgentAddress: "",
          custAgentDistrict: "",
          custAgentState: "",
        }));
        setSelectedAgent("");
      } else if (newType === "Agent") {
        setFormData((prev) => ({
          ...prev,
          customerName: "",
          state: "",
          district: "",
          mobileNumber: "",
          email: "",
          address: "",
          agentName: "",
          agentContact: "",
          agentEmail: "",
          agentState: "",
          agentDistrict: "",
          custAgentName: "",
          custAgentContact: "",
          custAgentEmail: "",
          custAgentAddress: "",
          custAgentDistrict: "",
          custAgentState: "",
        }));
        setSelectedAgent("");
      } else {
        setFormData((prev) => ({
          ...prev,
          customerName: "",
          state: "",
          district: "",
          mobileNumber: "",
          email: "",
          address: "123 Main St, Apt 4B",
          agentName: "",
          agentContact: "",
          agentEmail: "",
          agentState: "",
          agentDistrict: "",
          custAgentName: "",
          custAgentContact: "",
          custAgentEmail: "",
          custAgentAddress: "",
          custAgentDistrict: "",
          custAgentState: "",
        }));
        setSelectedAgent("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredCheck = () => {
      if (formData.customerType === "Customer") {
        if (!formData.customerName.trim() || !formData.state.trim() || !formData.district.trim() ||
            !formData.mobileNumber.trim() || !formData.address.trim()) {
          return "Please fill all required fields for Customer.";
        }
      } else if (formData.customerType === "Agent") {
        if (!formData.agentName.trim() || !formData.agentContact.trim() || !formData.agentState.trim() ||
            !formData.agentDistrict.trim()) {
          return "Please fill all required fields for Agent.";
        }
      } else if (formData.customerType === "Customer of Selected Agent") {
        if (!selectedAgent || !formData.custAgentName.trim() || !formData.custAgentContact.trim() ||
            !formData.custAgentState.trim() || !formData.custAgentDistrict.trim() || !formData.address.trim()) {
          return "Please fill all required fields for Customer of Selected Agent.";
        }
      }
      return null;
    };

    const validationError = requiredCheck();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const payload = {
        customer_name: formData.customerName?.trim() || "",
        state: formData.state?.trim() || "",
        district: formData.district?.trim() || "",
        mobile_number: formData.mobileNumber?.trim() || "",
        email: formData.email ? formData.email.trim() : null,
        address: formData.address?.trim() || "",
        customer_type: formData.customerType?.trim() || "",
        agent_id: selectedAgent || null,
        agent_name: formData.agentName ? formData.agentName.trim() : null,
        agent_contact: formData.agentContact ? formData.agentContact.trim() : null,
        agent_email: formData.agentEmail ? formData.agentEmail.trim() : null,
        agent_state: formData.agentState ? formData.agentState.trim() : null,
        agent_district: formData.agentDistrict ? formData.agentDistrict.trim() : null,
        cust_agent_name: formData.custAgentName ? formData.custAgentName.trim() : null,
        cust_agent_contact: formData.custAgentContact ? formData.custAgentContact.trim() : null,
        cust_agent_email: formData.custAgentEmail ? formData.custAgentEmail.trim() : null,
        cust_agent_address: formData.custAgentAddress ? formData.custAgentAddress.trim() : null,
        cust_agent_district: formData.custAgentDistrict ? formData.custAgentDistrict.trim() : null,
        cust_agent_state: formData.custAgentState ? formData.custAgentState.trim() : null,
      };

      const response = await fetch(`${API_BASE_URL}/api/directcust/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend response:", errorData);
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setSuccess(true);
      setError(null);
      setFormData({
        customerName: "",
        state: "",
        district: "",
        mobileNumber: "",
        email: "",
        address: "",
        customerType: "Customer",
        agentName: "",
        agentContact: "",
        agentEmail: "",
        agentState: "",
        agentDistrict: "",
        custAgentName: "",
        custAgentContact: "",
        custAgentEmail: "",
        custAgentAddress: "",
        custAgentDistrict: "",
        custAgentState: "",
      });
      setSelectedAgent("");
      setDistricts([]);
    } catch (error) {
      console.error("Error saving customer:", error);
      setError(error.message || "Failed to save customer. Please check the console for details.");
      setSuccess(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Logout />
      <div className="flex-1 p-6 hundred:ml-[15%] onefifty:ml-[15%] mobile:ml-[0%]">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Add Customer</h1>
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
              Data entered successfully
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Select Customer Type</h2>
                <div className="mt-6 sm:col-span-3">
                  <label htmlFor="customerType" className="block text-sm font-medium leading-6 text-gray-900">
                    Customer Type
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      id="customerType"
                      name="customerType"
                      value={formData.customerType}
                      onChange={handleChange}
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6"
                      required
                    >
                      <option value="Customer">Customer</option>
                      <option value="Agent">Agent</option>
                      <option value="Customer of Selected Agent">Customer of Selected Agent</option>
                    </select>
                    <svg
                      className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      aria-hidden="true"
                      data-slot="icon"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {formData.customerType === "Customer" && (
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="customerName" className="block text-sm font-medium leading-6 text-gray-900">
                        Customer Name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="customerName"
                          id="customerName"
                          value={formData.customerName}
                          onChange={handleChange}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="Jane Smith"
                          required
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="state" className="block text-sm font-medium leading-6 text-gray-900">
                        State
                      </label>
                      <div className="mt-2 grid grid-cols-1">
                        <select
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6"
                          required
                        >
                          <option value="">Select a state</option>
                          {states.map((state) => (
                            <option key={state.name} value={state.name}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          aria-hidden="true"
                          data-slot="icon"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="district" className="block text-sm font-medium leading-6 text-gray-900">
                        District
                      </label>
                      <div className="mt-2 grid grid-cols-1">
                        <select
                          id="district"
                          name="district"
                          value={formData.district}
                          onChange={handleChange}
                          disabled={!formData.state}
                          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6"
                          required
                        >
                          <option value="">Select a district</option>
                          {districts.map((district) => (
                            <option key={district.id} value={district.name}>
                              {district.name}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          aria-hidden="true"
                          data-slot="icon"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="mobileNumber" className="block text-sm font-medium leading-6 text-gray-900">
                        Mobile Number
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="mobileNumber"
                          id="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          pattern="\d{10}"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="1234567890"
                          required
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                        Email (Optional)
                      </label>
                      <div className="mt-2">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="jane@example.com"
                        />
                      </div>
                    </div>
                    <div className="col-span-full">
                      <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                        Address
                      </label>
                      <div className="mt-2">
                        <textarea
                          name="address"
                          id="address"
                          rows="3"
                          value={formData.address}
                          onChange={handleChange}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="123 Main St, Apt 4B"
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>
                )}

                {formData.customerType === "Agent" && (
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="agentName" className="block text-sm font-medium leading-6 text-gray-900">
                        Agent Name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="agentName"
                          id="agentName"
                          value={formData.agentName}
                          onChange={handleChange}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="Agent Name"
                          required
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="agentContact" className="block text-sm font-medium leading-6 text-gray-900">
                        Agent Contact
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="agentContact"
                          id="agentContact"
                          value={formData.agentContact}
                          onChange={handleChange}
                          pattern="\d{10}"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="1234567890"
                          required
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="agentEmail" className="block text-sm font-medium leading-6 text-gray-900">
                        Agent Email (Optional)
                      </label>
                      <div className="mt-2">
                        <input
                          type="email"
                          name="agentEmail"
                          id="agentEmail"
                          value={formData.agentEmail}
                          onChange={handleChange}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="agent@example.com"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="agentState" className="block text-sm font-medium leading-6 text-gray-900">
                        Agent State
                      </label>
                      <div className="mt-2 grid grid-cols-1">
                        <select
                          id="agentState"
                          name="agentState"
                          value={formData.agentState}
                          onChange={handleChange}
                          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6"
                          required
                        >
                          <option value="">Select a state</option>
                          {states.map((state) => (
                            <option key={state.name} value={state.name}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          aria-hidden="true"
                          data-slot="icon"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="agentDistrict" className="block text-sm font-medium leading-6 text-gray-900">
                        Agent District
                      </label>
                      <div className="mt-2 grid grid-cols-1">
                        <select
                          id="agentDistrict"
                          name="agentDistrict"
                          value={formData.agentDistrict}
                          onChange={handleChange}
                          disabled={!formData.agentState}
                          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6"
                          required
                        >
                          <option value="">Select a district</option>
                          {districts.map((district) => (
                            <option key={district.id} value={district.name}>
                              {district.name}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          aria-hidden="true"
                          data-slot="icon"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="col-span-full">
                      <label htmlFor="agentAddress" className="block text-sm font-medium leading-6 text-gray-900">
                        Agent Address
                      </label>
                      <div className="mt-2">
                        <textarea
                          name="agentAddress"
                          id="agentAddress"
                          rows="3"
                          value={formData.address}
                          onChange={handleChange}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="123 Main St, Apt 4B"
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>
                )}

                {formData.customerType === "Customer of Selected Agent" && (
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="selectedAgent" className="block text-sm font-medium leading-6 text-gray-900">
                        Select Agent
                      </label>
                      <div className="mt-2 grid grid-cols-1">
                        <select
                          id="selectedAgent"
                          name="selectedAgent"
                          value={selectedAgent}
                          onChange={(e) => {
                            setSelectedAgent(e.target.value);
                            setError(null);
                          }}
                          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6"
                          required
                        >
                          <option value="">Select an agent</option>
                          {agents.map((agent) => (
                            <option key={agent.id} value={agent.id}>
                              {agent.customer_name}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          aria-hidden="true"
                          data-slot="icon"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="sm:col-span-4">
                      <label htmlFor="custAgentName" className="block text-sm font-medium leading-6 text-gray-900">
                        Customer Agent Name
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="custAgentName"
                          id="custAgentName"
                          value={formData.custAgentName}
                          onChange={handleChange}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="Customer Agent Name"
                          required
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="custAgentContact" className="block text-sm font-medium leading-6 text-gray-900">
                        Customer Agent Contact
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="custAgentContact"
                          id="custAgentContact"
                          value={formData.custAgentContact}
                          onChange={handleChange}
                          pattern="\d{10}"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="1234567890"
                          required
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="custAgentEmail" className="block text-sm font-medium leading-6 text-gray-900">
                        Customer Agent Email (Optional)
                      </label>
                      <div className="mt-2">
                        <input
                          type="email"
                          name="custAgentEmail"
                          id="custAgentEmail"
                          value={formData.custAgentEmail}
                          onChange={handleChange}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="custagent@example.com"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="custAgentState" className="block text-sm font-medium leading-6 text-gray-900">
                        Customer Agent State
                      </label>
                      <div className="mt-2 grid grid-cols-1">
                        <select
                          id="custAgentState"
                          name="custAgentState"
                          value={formData.custAgentState}
                          onChange={handleChange}
                          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6"
                          required
                        >
                          <option value="">Select a state</option>
                          {states.map((state) => (
                            <option key={state.name} value={state.name}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          aria-hidden="true"
                          data-slot="icon"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <label htmlFor="custAgentDistrict" className="block text-sm font-medium leading-6 text-gray-900">
                        Customer Agent District
                      </label>
                      <div className="mt-2 grid grid-cols-1">
                        <select
                          id="custAgentDistrict"
                          name="custAgentDistrict"
                          value={formData.custAgentDistrict}
                          onChange={handleChange}
                          disabled={!formData.custAgentState}
                          className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6"
                          required
                        >
                          <option value="">Select a district</option>
                          {districts.map((district) => (
                            <option key={district.id} value={district.name}>
                              {district.name}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          aria-hidden="true"
                          data-slot="icon"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="col-span-full">
                      <label htmlFor="custAgentAddress" className="block text-sm font-medium leading-6 text-gray-900">
                        Customer Agent Address
                      </label>
                      <div className="mt-2">
                        <textarea
                          name="custAgentAddress"
                          id="custAgentAddress"
                          rows="3"
                          value={formData.custAgentAddress}
                          onChange={handleChange}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="123 Main St, Apt 4B"
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-gray-900"
                  onClick={() => {
                    setFormData({
                      customerName: "",
                      state: "",
                      district: "",
                      mobileNumber: "",
                      email: "",
                      address: "",
                      customerType: "Customer",
                      agentName: "",
                      agentContact: "",
                      agentEmail: "",
                      agentState: "",
                      agentDistrict: "",
                      custAgentName: "",
                      custAgentContact: "",
                      custAgentEmail: "",
                      custAgentAddress: "",
                      custAgentDistrict: "",
                      custAgentState: "",
                    });
                    setSelectedAgent("");
                    setError(null);
                    setSuccess(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md cursor-pointer px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 bg-black/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}