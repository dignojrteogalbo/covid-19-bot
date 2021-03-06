const fetch = require('node-fetch');
require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;

const CORONA = 'https://corona.lmao.ninja';

function messageCountryEmbed(info) {
  return new Discord.MessageEmbed()
  .setColor('#0099ff')
  .setTitle('COVID-19 Tracker')
	.setTimestamp()
  .setDescription(`Statistics for COVID-19 in ${info.country}`)
  .addFields(
    {name: '**Cases**', value: `There is ${info.cases} case(s) in ${info.country}.`, inline: true},
    {name: '**Cases Today**', value: `There is ${info.todayCases} case(s) today.`, inline: true},
    {name: '**Deaths**', value: `There is ${info.deaths} death(s).`, inline: true},
    {name: '**Deaths Today**', value: `There is ${info.todayDeaths} deaths today.`, inline: true},
    {name: '**Recovered**', value: `${info.recovered} have recovered from COVID-19 in ${info.country}.`, inline: true},
    {name: '**Critical**', value: `${info.critical} in critical condition in ${info.country}.`, inline: true}
  )
  .setFooter('https://github.com/dignojrteogalbo/covid-19-bot');
}

function messageWorldEmbed(info) {
  return new Discord.MessageEmbed()
  .setColor('#0099ff')
  .setTitle('COVID-19 Tracker')
	.setTimestamp()
  .setDescription(`Statistics for COVID-19 Worldwide`)
  .addFields(
    {name: '**Cases**', value: `There is ${info.cases} total cases.`, inline: true},
    {name: '**Deaths**', value: `There is a total of ${info.deaths} deaths.`, inline: true},
    {name: '**Recovered**', value: `${info.recovered} have recovered from COVID-19.`, inline: true},
    {name: '**Last Updated**', value: `${new Date(info.updated)}`, inline: true}
  )
  .setFooter('https://github.com/dignojrteogalbo/covid-19-bot');
}

function messageHelpEmbed() {
  return new Discord.MessageEmbed()
  .setColor('#0099ff')
  .setTitle('COVID-19 Tracker')
	.setTimestamp()
  .setDescription(`How to Use COVID-19 Tracker Bot`)
  .addFields(
    {name: '**Get Statistics Worldwide**', value: 'Type ``?corona``', inline: false},
    {name: '**Get Statistics for A Specific Country**', value: 'Type ``?corona [country name]``', inline: false}
  )
  .setFooter('https://github.com/dignojrteogalbo/covid-19-bot');
}

function messageErrorEmbed() {
  return new Discord.MessageEmbed()
  .setColor('#0099ff')
  .setTitle('COVID-19 Tracker')
	.setTimestamp()
  .setDescription(`No country found or check your spelling.`)
  .setFooter('https://github.com/dignojrteogalbo/covid-19-bot');
}

bot.login(TOKEN);

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
  bot.user.setPresence({ activity: {name: 'Type ?corona help' }, status: 'ready' });
});

bot.on('message', msg => {
  const prefix = "?corona";
  const args = msg.content.slice(prefix.length).split(' ');
  if (msg.content.startsWith(prefix) && args.includes('help')) {
    msg.channel.send(messageHelpEmbed());
  } else if (msg.content.startsWith(prefix) && args.length > 1) {
    fetch(`${CORONA}/countries/${args[1]}`)
      .then(res => {
        res
          .json()
          .then(data => {
            msg.channel.send(messageCountryEmbed(data));
          })
          .catch(err => {
            console.log(err);
            msg.channel.send(messageErrorEmbed());
          });
      });
  } else if (msg.content.startsWith(prefix) && args.length === 1) {
    fetch(`${CORONA}/all`)
      .then(res => {
        res
          .json()
          .then(data => {
            msg.channel.send(messageWorldEmbed(data));
          })
      });
  }
});
