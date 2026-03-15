# REACT-CULQI-NEXT

A React library for integrating the Culqi payment processor, compatible with Next.js.

---

## Usage

### Culqi Checkout Custom (Recommended)

The newer integration method — more customizable and with better control over all payment events, including `onClose`.

```tsx
import { CulqiProviderCustom, useCheckoutCustom } from 'react-culqi-next';

const MyApp = () => {
  return (
    <CulqiProviderCustom publicKey="pk_test_your_public_key">
      <MyButton />
    </CulqiProviderCustom>
  );
};

const MyButton = () => {
  const { openCulqiCustom, token, error } = useCheckoutCustom({
    settings: {
      title: 'White T-shirt',
      currency: 'PEN',
      amount: 10000, // Amount in cents (S/ 100.00)
      // order: 'ord_live_xxxx', // Required for Yape, PagoEfectivo, Cuotéalo
    },
    options: {
      lang: 'auto',
      installments: false,
      paymentMethods: {
        tarjeta: true,
        yape: true,
      },
    },
    onClose: () => {
      console.log('Checkout closed by user');
    },
    onToken: (token) => {
      console.log('Token created:', token);
      // Send token.id to your backend
    },
    onError: (error) => {
      console.error('Error:', error.user_message);
    },
  });

  return (
    <>
      <button onClick={openCulqiCustom}>Pay now</button>
      {error && <p style={{ color: 'red' }}>{error.user_message}</p>}
    </>
  );
};
```

#### With appearance customization

```tsx
const { openCulqiCustom } = useCheckoutCustom({
  settings: { title: 'My Store', currency: 'PEN', amount: 5000 },
  options: {
    lang: 'auto',
    installments: true,
    paymentMethods: { tarjeta: true, yape: true },
  },
  appearance: {
    theme: 'default',
    menuType: 'sidebar',
    hiddenCulqiLogo: false,
    variables: {
      colorBackground: '#0A2540',
      colorPrimary: '#EFC078',
      colorText: 'white',
      borderRadius: '8px',
    },
  },
  onToken: (token) => console.log(token),
  onClose: () => console.log('closed'),
});
```

#### With pre-filled client email

```tsx
const { openCulqiCustom } = useCheckoutCustom({
  settings: { title: 'My Store', currency: 'PEN', amount: 5000 },
  client: { email: 'customer@example.com' },
  options: { lang: 'auto', installments: false },
  onToken: (token) => console.log(token),
});
```

---

### Version 4 (Legacy)

> **Note**: Culqi has announced that Checkout v4 may be deprecated in the future. Consider using Checkout Custom for new integrations.

![Version 4](./culqiV4.png)

```tsx
import { CulqiProvider, useCheckout } from 'react-culqi-next';

const MyApp = () => {
  return (
    <CulqiProvider publicKey="pk_test_your_public_key">
      <MyButton />
    </CulqiProvider>
  );
};

const MyButton = () => {
  const { openCulqi, token, error } = useCheckout({
    settings: {
      title: 'White T-shirt',
      currency: 'PEN',
      amount: 10000,
      options: {
        lang: 'auto',
        installments: false,
        paymentMethods: {
          tarjeta: true,
          yape: true,
        },
      },
    },
    onClose: () => {
      console.log('Checkout closed by user');
    },
    onToken: (token) => {
      console.log('Send token to backend:', token.id);
    },
    onError: (error) => {
      console.error('Error:', error);
    },
  });

  return (
    <button onClick={openCulqi}>Pay now</button>
  );
};
```

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
