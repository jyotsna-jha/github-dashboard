export default function Header() {
  return (
    <div className="relative">
      <h1 className="text-2xl md:text-4xl font-bold font-poppins py-2" style={{ color: '#54a0ff' }}>
        Jyotsna's Dev Dashboard
      </h1>
      <p className="mt-3 text-base font-montserrat" style={{ color: '#e6ebed' }}>
        Tracking my <span className="font-medium" style={{ color: '#54a0ff' }}>GitHub</span> activity in real time
      </p>
      
      {/* Animated background elements */}
      <div className="absolute -top-4 -left-4 w-20 h-20 rounded-full opacity-10 animate-ping" style={{ backgroundColor: '#54a0ff' }}></div>
      <div className="absolute -bottom-2 -right-4 w-16 h-16 rounded-full opacity-10 animate-bounce" style={{ backgroundColor: '#54a0ff' }}></div>
    </div>
  );
}