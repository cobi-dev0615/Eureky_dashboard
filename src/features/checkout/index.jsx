import React, { useEffect, useState } from 'react';
import { paymentsService } from '../../shared/services/payments';

const Checkout = () => {
  const [loading, setLoading] = useState(false);

  const handleBuyPlan = async (buyPackage) => {
    try {
      const { userId } = JSON.parse(localStorage.getItem("user")) || {};
      console.log("**User ID:", userId);
      if (!userId) {
        alert("Por favor, inicia sesión para continuar con la compra.");
        return;
      }
      
      const res = await paymentsService.createCheckoutSession(buyPackage, userId, 'stripe');

      if (res?.success && res.data?.url) {
        window.location.href = res.data.url;
      } else {
        console.error("No redirect URL:", res);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  useEffect(() => {
    const processPaymentRedirect = async () => {
      const params = new URLSearchParams(window.location.search);

      const isSuccess = params.get("success") === "true";
      const sessionId = params.get("session_id");
      const isCanceled = params.get("cancel") === "true";

      if (isSuccess && sessionId) {
        setLoading(true);

        try {
          const verify = await paymentsService.verifyPayment(sessionId);

          console.log("Payment verified:", verify);

          if (verify.success) {
            alert("Pago verificado correctamente.");
          } else {
            alert("Hubo un problema verificando el pago.");
          }
        } catch (err) {
          console.error("Error verifying payment:", err);
          alert("Error verificando el pago.");
        } finally {
          setLoading(false);
        }

      } else if (isCanceled) {
        alert("Pago cancelado.");
      }


      if (isSuccess || isCanceled) {
        const url = new URL(window.location.href);
        url.searchParams.delete("success");
        url.searchParams.delete("session_id");
        url.searchParams.delete("cancel");
        window.history.replaceState({}, document.title, url.pathname);
      }
    };

    processPaymentRedirect();
  }, []);

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {loading && <p>Validando pago...</p>}

      <button type="button" onClick={() => handleBuyPlan("package1")}>
        pack 1
      </button>

      <button type="button" onClick={() => handleBuyPlan("package2")}>
        pack 2
      </button>

      <button type="button" onClick={() => handleBuyPlan("package3")}>
        pack 3
      </button>
    </div>
  );
};

export default Checkout;
