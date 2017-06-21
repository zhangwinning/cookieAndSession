# cookie
由于http是无状态协议,为了保持一个状态,引出cookie
### cookie处理流程
1. 服务器向客户端发送Cookie;<br />
2. 浏览器将cookie保存;<br />
3. 之后每次浏览器发送都会携带cookie;<br />

### 客户端和服务器处理cookie的具体形式
1. 客户端发送的Cookie在请求报文的Cookie字段上,我们可以通过curl工具构造这个字段，
如下:<br />
curl -v -H "Cookie: foo=bar; baz = val" "http://localhost:9000"
2. HTTP_Parser会将报文信息解析到req.header字段上;那么Cookie就是
req.header.cookie。这里获取的是cookie的字段串,通过自定义解析把cookie解析成
JSON数据。(parseCookie方法);<br />
3. 服务器将更新的cookie信息发送至客户端;
> 1. 告知客户端的方式是通过相应报文形式实现的。
> 2. 相应的Cookie值设置到Set-Cookie字段中。
> 3. 客户端收到Set-Cookie响应后,之后的请求会加上Cookie字段中值。
### 详见代码test/001.js
# session			
通过cookie,浏览器和服务器可以实现状态记录,但是cookie最为严重的问题是不安全(cookie在前后端容易被修改),引出session <br />
### session安全的原因:
1. 虽然将所有数据放到Cookie中不可取,但是将口令放到Cookie中是可以的。因为口令被修改,
丢失映射关系,从而无法修改服务器端数据。
2. session有效期非常短,通常20min内服务器和客户端没有交互行为,服务端数据将要被删除。
### 使用session两种实现方式:
#### 1.基于cookie实现用户和数据的映射
  生成session口令的方法(generate).
  这样在session中保存的数据比直接在cookie中保存的数据安全的多,这种实现方案依赖Cookie的实现,而且是
  现在大多数web应用的方案.
### 详见代码test/002.js(测试成功)

#### 2.通过查询字符串来实现客户端和浏览器之间的对应

### Session与内存
> 上面代码中,我们将Session信息存在变量sessions中,sessions位于内存中.把sessions放到内存中有2个缺点:
> > 1. 如果用户剧增,可能会达到内存限制的上限 <br />
> > 2. 内存中数据增加,会引起垃圾回收机制的频繁扫描,从而引起性能问题 <br />
> > 3. 我们为了利用多核CPU从而启动多个进程,用户请求的连接会随意分配各个线程中,而node的线程和线程之间不能直接共享内存的 <br />

> 为解决性能问题和Session无法跨线程共享问题,常见的是将Session 集中化,统一转移到数据库中存储.比如redis
