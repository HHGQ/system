const hello : string = 'hello world'
console.log(hello)

// 类型断言
var str1: any = '1';
var str2: number = str1 as number;  //str、str2 是 string 类型
var str3: number = str2
console.log(typeof str1);
console.log(typeof str2);
console.log(typeof str3);

// 数组类型
var nums:number[] = [1,2,3,4] 
var nums2:Array<number> = [1,2,3,4] 

// typescript 接口
interface a {
  age: number
}
interface aa extends a {
  name: string
}

var b: aa = {
  age: 1,
  name: '1'
}

// 函数返回值类型
function f(): number {
  return 1
}
function g(): void {

}

// typescript类
class person {
  static a: string = '1';
  Area: number
  constructor(a:number) { 
    this.Area = a 
  }
}
var person1 = new person(1)
console.log(person.a)
console.log(person1.Area)

interface ILoan { 
  interest:number,
  a: number 
} 
class AgriLoan implements ILoan { 
  interest:number 
  rebate:number 
  public a: number = 1
  static a: number = 2
  
  constructor(interest:number,rebate:number) { 
     this.interest = interest 
     this.rebate = rebate 
  } 
} 
var obj = new AgriLoan(10,1) 
console.log("利润为 : "+obj.interest+"，抽成为 : "+obj.rebate )
console.log(AgriLoan.a)
console.log(obj.a)