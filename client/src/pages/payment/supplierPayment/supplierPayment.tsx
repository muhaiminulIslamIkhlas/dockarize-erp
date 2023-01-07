import { Button, Input, Select } from "antd";
import { Report } from "notiflix";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../../components/atom/container/container";
import Header from "../../../components/atom/heading/header";
import Admin from "../../../components/templates/dashboard/admin"
import { get, store } from "../../../services/dataServices";

const SupplierPayment: React.FC = () => {
    const navigate = useNavigate();
    const dateConst = new Date();
    const [date, setDate] = useState<string>(dateConst.toISOString().slice(0, 10),);
    const [supplier, setSupplier] = useState<any>([]);
    const [invoice, setInvoice] = useState<any>([]);
    const [due, setDue] = useState<any>(0);
    const [purchaseId, setPurchaseId] = useState<any>(0);
    const [account, setAccount] = useState<any>([]);
    const [payment, setPayment] = useState<number>(0);
    const [supplierId, setSupplierId] = useState<number>(0);
    const [accountId, setAccountId] = useState<any>(null);
    const getAllCustomer = async () => {
        let allCustomer = await get("get-all-supplier-select", false);
        setSupplier(allCustomer.data);
    };

    const getCustomerDue = async (customerId: any) => {
        const customerDue = await get("get-previous-due/" + customerId, false);
        setDue(customerDue.data);
    }

    const getAccount = async () => {
        const customerDue = await get("get-all-account-select", false);
        setAccount(customerDue.data);
    }

    const getInvoice = async (supplierId: any) => {
        const invoiceData = await get("get-all-invoice-due/" + supplierId, false);
        setInvoice(invoiceData.data);
    }

    const handleSupplierChange = (value: any) => {
        setSupplierId(value)
        getInvoice(value);
    }

    const handleInvoiceChange = (value: any) => {
        invoice.map((i: any) => {
            if (i.value === value) {
                setDue(i.due);
            }
        })
        setPurchaseId(value);
    }

    const handlePaymentChange = (e: any) => {
        const value = parseInt(e.target.value);
        if (value > due) {
            Report.warning(
                'Warning',
                'Payment must equal or lower than total due',
                'Okay',
            );
            return;
        }

        if (!accountId) {
            Report.warning(
                'Warning',
                'Please select an account',
                'Okay',
            );
            return;
        }
        setPayment(value);
    }

    const completePayment = async () => {
        const data = {
            supplier_id: supplierId,
            amount: payment,
            account_id: accountId,
            purchase_id: purchaseId,
            date: date
        };
        let response = await store(data, "supplier-payment");
        if (response) {
            navigate('/customers-payment-list');
        }
    }

    const handleAccountChange = (value: any) => {
        setAccountId(value);
    }

    const handleChangeDate = (e: any) => {
        setDate(e.target.value);
    }

    useEffect(() => {
        getAllCustomer();
        getAccount();
    }, ["customer"]);

    return (<Admin type="light">
        <Header Tag="h2" text="Supplier Payment" />
        <Container margin="16">
            <p style={{ fontSize: '14px', color: 'darkblue', fontWeight: 'bold' }}>Supplier</p>
            <Container margin="8">
                <Select
                    defaultValue="--Select Customer--"
                    style={{ width: 420 }}
                    onChange={handleSupplierChange}
                    options={supplier}
                />
            </Container>
        </Container>
        <Container margin="8">
            <p style={{ fontSize: '14px', color: 'darkblue', fontWeight: 'bold' }}>All Invoice</p>
            <Container margin="8">
                <Select
                    defaultValue="--Select Invoice--"
                    style={{ width: 420 }}
                    onChange={handleInvoiceChange}
                    options={invoice}
                />
            </Container>
        </Container>
        <Container margin="8">
            <p style={{ fontSize: '14px', color: 'darkblue', fontWeight: 'bold' }}>Account</p>
            <Container margin="8">
                <Select
                    defaultValue="--Select Account--"
                    style={{ width: 420 }}
                    onChange={handleAccountChange}
                    options={account}
                />
            </Container>
        </Container>
        <Container margin="8">
            <p style={{ fontSize: '14px', color: 'darkblue', fontWeight: 'bold' }}>Total Due</p>
            <Container margin="8">
                <Input type="number" style={{ width: 420 }} value={due} />
            </Container>
        </Container>
        <Container margin="8">
            <p style={{ fontSize: '14px', color: 'darkblue', fontWeight: 'bold' }}>Total Payment</p>
            <Container margin="8">
                <Input type="number" value={payment} name="payment" onChange={handlePaymentChange} style={{ width: 420 }} />
            </Container>
        </Container>
        <Container margin="8">
            <p style={{ fontSize: '14px', color: 'darkblue', fontWeight: 'bold' }}>Date</p>
            <Container margin="8">
                <Input type="date" value={date} name="date" onChange={handleChangeDate} style={{ width: 420 }} />
            </Container>
        </Container>
        <Container margin="16">
            <Button type="primary" size="middle" onClick={completePayment} disabled={payment > 0 ? false : true}>
                Complete Payment
            </Button>
        </Container>
    </Admin>)
}

export default SupplierPayment;