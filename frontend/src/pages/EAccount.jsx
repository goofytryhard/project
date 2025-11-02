export default function EAccount() {
  return (
    <div>
      <h2>Create Account</h2>
      <input type="text" placeholder="create your egundo id" />
      <input type="password" placeholder="password for egundo id" />
      <button>Create Account</button>

      <h2 style={{ marginTop: "20px" }}>Login</h2>
      <input type="text" placeholder="egundo id" />
      <input type="password" placeholder="password" />
      <button>Login</button>
    </div>
  );
}