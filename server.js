// express 모듈 불러오기
import express from 'express';
import postgresql from './postgresql.js';

// express app 인스턴스에 담기
const app = express();

// 포트 번호 상수
const PORT = 80;

app.listen(PORT, ()=>{
    console.log(`포트 번호 ${PORT} 서버접속`)
})

app.use(express.urlencoded({extended: true}))
// IF extended: true, 객체 형태로 전달된 데이터내에서 또다른 중첩된 객체를 허용한다
// IF extended: false, 객체 형태로 전달된 데이터내에서 또다른 중첩된 객체를 허용하지 않는다


const __dirname = 'C:/Users/DGBDS/WebstormProjects/mbti/'
// require로 하다가 import로 바꾸니까 __dirname을 못찾아서 에러남 -> 상수 할당


// DB Connect
postgresql();


app.get('/', (req, res)=>{
    res.sendFile(__dirname +'/index.html')
});

app.get('/input', (req, res)=>{
    res.sendFile(__dirname +'/input.html')
});

app.get('/view', async (req, res) => {
    const rows = await process.postgresql.query('SELECT * FROM main');
    let arrName = [];
    let arrPosition = [];
    let arrMbti = [];
    for (let i = 0; i<rows.length;i++) {
        arrName.push(rows[i].name)
        arrPosition.push(rows[i].position)
        arrMbti.push(rows[i].mbti)
    }

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
        <title>MBTI 조회 페이지</title>
        <style>
            table{ border-collapse : collapse; }  /*이중선 제거*/
            th,td{
                width: 100px;
                height: 50px;
                text-align: center;
                border: 1px solid #000;
    
                vertical-align: top;\t/* 위 */
                vertical-align: bottom;   /* 아래 */
                vertical-align: middle;   /* 가운데 */
            }
        </style>
    </head>
    <body>
        <h4 class="container mt-4"><strong>MBTI 등록 내역</strong></h4>
        <div class="container mt-3">
            <table>
                <tr>
                    <th>이름</th>
                    <th>직책</th>
                    <th>MBTI</th>
                </tr>
            </table>
            <p>${arrName}</p>
            <p>${arrPosition}</p>
            <p>${arrMbti}</p>
        </div>
        <div class="container mt-3">
            <div class='tableauPlaceholder' id='viz1659052998621' style='position: relative'><noscript><a href='#'><img alt='대시보드 1 ' src='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;mb&#47;mbti_16589852386240&#47;1_1&#47;1_rss.png' style='border: none' /></a></noscript><object class='tableauViz'  style='display:none;'><param name='host_url' value='https%3A%2F%2Fpublic.tableau.com%2F' /> <param name='embed_code_version' value='3' /> <param name='site_root' value='' /><param name='name' value='mbti_16589852386240&#47;1_1' /><param name='tabs' value='no' /><param name='toolbar' value='yes' /><param name='static_image' value='https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;mb&#47;mbti_16589852386240&#47;1_1&#47;1.png' /> <param name='animate_transition' value='yes' /><param name='display_static_image' value='yes' /><param name='display_spinner' value='yes' /><param name='display_overlay' value='yes' /><param name='display_count' value='yes' /><param name='language' value='ko-KR' /><param name='filter' value='publish=yes' /></object></div>                <script type='text/javascript'>                    var divElement = document.getElementById('viz1659052998621');                    var vizElement = divElement.getElementsByTagName('object')[0];                    if ( divElement.offsetWidth > 800 ) { vizElement.style.width='1000px';vizElement.style.height='827px';} else if ( divElement.offsetWidth > 500 ) { vizElement.style.width='1000px';vizElement.style.height='827px';} else { vizElement.style.width='100%';vizElement.style.height='727px';}                     var scriptElement = document.createElement('script');                    scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';                    vizElement.parentNode.insertBefore(scriptElement, vizElement);                </script>
        </div>
    </body>
    </html>
    `
    res.send(html);
});

app.post('/add', async (req, res)=>{

    var data = req.body;

    var today = new Date();
    data.firstDate = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
    data.recentDate = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();

    const queryString = `INSERT INTO main(name, position, mbti, recent_date, first_date)
    VALUES('${data.name}', '${data.position}', '${data.mbti}', '${data.recentDate}',
        (CASE (SELECT EXISTS (SELECT id FROM main WHERE name = '${data.name}' ORDER BY recent_date LIMIT 1) AS existence)
            WHEN true THEN (SELECT first_date FROM main WHERE name = '${data.name}' LIMIT 1)  
            WHEN false THEN '${data.recentDate}'   
        END))`;

    const rows = await process.postgresql.query(queryString);

    res.send('전송완료');
});

