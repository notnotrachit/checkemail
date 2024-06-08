import type { NextApiRequest, NextApiResponse } from 'next'
import { getClassification } from "@/lib/ai";
const jsdom = require("jsdom");
const htmlToText = require('html-email-to-text');

export async function POST(req: Request, res: NextApiResponse) {
    var decodeBase64 = function(s:any) {
        var e: {[key: string]: number} = {}, i, b = 0, c, x, l = 0, a, r = '', w = String.fromCharCode, L = s.length;
        var A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        for (i = 0; i < 64; i++) { e[A.charAt(i)] = i; }
        for (x = 0; x < L; x++) {
            c = e[s.charAt(x)]; b = (b << 6) + c; l += 6;
            while (l >= 8) { ((a = (b >>> (l -= 8)) & 0xff) || (x < (L - 2))) && (r += w(a)); }
        }
        return r;
    };

    function extractContent(s: any, space: any) {
        const dom = new jsdom.JSDOM();
        var span= dom.window.document.createElement('span');
        span.innerHTML= s;
        if(space) {
            var children= span.querySelectorAll('*') as any;
            for(var i = 0 ; i < children.length ; i++) {
            if(children[i].textContent)
                children[i].textContent+= ' ';
            else
                children[i].innerText+= ' ';
            }
        }
        return [span.textContent || span.innerText].toString().replace(/ +/g,' ');
    };

    let {emails,oaiKey} = await req.json();
    for (let i = 0; i < emails.length; i++) {
        if (emails[i].payload.body.data) {
            let data = decodeBase64(emails[i].payload.body.data);
            data = data.replace(/<style([\s\S]*?)<\/style>/gi, ' ').replace(/<script([\s\S]*?)<\/script>/gi, ' ').replace(/(<(?:.|\n)*?>)/gm, ' ').replace(/\s+/gm, ' ');
            let classification = await getClassification(data, oaiKey);
            emails[i].classification = classification.category;
        }
        else if(emails[i].payload.parts){
            let collective_data = "";
            for (let j = 0; j < emails[i].payload.parts.length; j++) {
                if (emails[i].payload.parts[j].mimeType == "text/plain") {
                    collective_data += decodeBase64(emails[i].payload.parts[j].body.data);
                }
            }
            collective_data = collective_data.replace(/<style([\s\S]*?)<\/style>/gi, ' ').replace(/<script([\s\S]*?)<\/script>/gi, ' ').replace(/(<(?:.|\n)*?>)/gm, ' ').replace(/\s+/gm, ' ');
            let classification = await getClassification(collective_data, oaiKey);
            emails[i].classification = classification.category;
        }
    }
    return Response.json(emails)
}