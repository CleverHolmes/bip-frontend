import 'react-datepicker/dist/react-datepicker.css';
import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import React from 'react';

import { GSSPBasic } from 'utils/gsspBasic';
import Layout from 'components/Layout';
import Paper from 'components/Paper';

export const getServerSideProps: GetServerSideProps = GSSPBasic();

const LicensorTerms: NextPage = () => {
  return (
    <div className="relative">
      <Head>
        <title>Licensee Terms</title>
      </Head>
      <Layout simpleHeader={true}>
        <div className="mb-10 text-xl font-bold text-primary font-custom1 md:text-3xl lg:text-5xl">
          Licensee Terms
        </div>
        <Paper className="mb-10">
          <p>
            <strong>Licensee Terms of Use</strong>
          </p>
          <p>
            <em>Last Updated: November 2, 2022</em>
          </p>
          <p>
            The BIP website located at&nbsp;https://bip.co/ is owned and
            operated by BIP Market, LLC, a Delaware limited liability company
            which does business as BIP (&ldquo;this Website&rdquo;).
          </p>
          <p>
            PLEASE READ THESE TERMS OF USE CAREFULLY BEFORE USING THIS SITE.
            THESE TERMS OF USE CONSTITUTE A LEGALLY BINDING AGREEMENT BETWEEN
            YOU AND BIP. BY ACCESSING OR USING ANY PART OF THIS WEBSITE, YOU
            AGREE THAT YOU HAVE READ, UNDERSTAND AND AGREE TO BE BOUND BY THESE
            TERMS OF USE. IF YOU DO NOT AGREE TO BE SO BOUND, DO NOT ACCESS OR
            USE THIS WEBSITE. &nbsp;
          </p>
          <p>
            <strong>Privacy</strong>
          </p>
          <p>
            By using this Website, you consent to the terms of BIP&rsquo;s
            Privacy Policy, which you understand may be modified from time to
            time. The Privacy Policy, which can be reached by clicking on the
            Privacy Policy link located at the bottom of the Website, is
            incorporated into these Terms of Use by reference. You consent to
            BIP&rsquo;s use of cookies and similar devices as further described
            in the Privacy Policy and for the purposes set forth in the Privacy
            Policy. You further understand and agree that, to the extent that
            information is collected about you, it will be stored on servers in
            the United States.<strong>&nbsp;</strong>
          </p>
          <p>
            <strong>Accounts</strong>
          </p>
          <p>
            You are required to have an account on the Website (an
            &ldquo;Account&rdquo;) to access or participate in the features of
            this Website. You represent and warrant that all information
            provided in registering your Account is true and
            accurate.&nbsp;&nbsp;You do not own or have any rights in your
            Account. Under these Terms of Use, you are granted a limited,
            personal, non-transferable, non-commercial, revocable license to use
            your Account to access this Website. You may not sell or transfer
            all or any part of your Account. You may not use your Account in any
            way that violates these Terms of Use.&nbsp;
          </p>
          <p>
            You are responsible for maintaining the confidentiality of your
            Account.&nbsp;&nbsp;You are responsible for all activities that
            occur through the use of your Account regardless of whether you
            personally authorize such activities.&nbsp;&nbsp;You shall not allow
            any other person to access your Account.&nbsp;&nbsp;You shall
            immediately notify BIP of any unauthorized use of the Account or any
            other breach of security.&nbsp;&nbsp;BIP shall not be liable for any
            loss or damage arising from your failure to comply with these
            requirements.
          </p>
          <p>
            We reserve the right, in our sole and absolute discretion, to verify
            your identity and your authority to represent and/or legally bind
            any organization or entity that you purport to
            represent.&nbsp;&nbsp;The method of verification shall be determined
            by BIP in our sole and absolute discretion.&nbsp;&nbsp;Such
            verification methods may include the use of third party services,
            such as ID.me, or obtaining references from your organization or
            third party organizations, such as trade groups.&nbsp;&nbsp;You
            agree to comply with any request to verify your identity and/or
            authority and consent to the disclosure by BIP to third parties of
            any and all information about you, including personally identifiable
            information, that is reasonably useful in obtaining such
            verification.
          </p>
          <p>
            We reserve the right to refuse to register you and provide you with
            an Account and/or to deny you access to the Website and/or terminate
            your Account for any reason in our sole and absolute
            discretion.&nbsp;&nbsp;We may terminate or suspend your Account
            and/or access to all or part of this Website if we, in our sole and
            absolute discretion, determine that you have breached these Terms of
            Use or any other rule applicable to the Website or that your conduct
            violates applicable law or is otherwise harmful to the Website,
            other persons or us. Any such termination or suspension or removal
            shall be without liability to you. In addition, we may terminate or
            suspend your Account and/or access to all or part of this Website if
            we determine to cease all or a portion of our operations and/or the
            provision of any applicable products or services in connection with
            this Website. We reserve the right to change any or all of the
            features of and activities available on this Website at any time
            without notice. All such terminations, suspensions, removals and/or
            changes shall be without any liability to you.
          </p>
          <p>
            <strong>Business and Interactions with Licensors</strong>
          </p>
          <p>
            This Website allows you to contact and communicate, negotiate and
            enter into contracts with persons and organizations (each, a
            &ldquo;Licensor&rdquo;) for the licensing and use of brands,
            properties and other intellectual property (each, a
            &ldquo;Property&rdquo;).&nbsp;&nbsp;While BIP takes reasonable steps
            to verify the identity and authority of each Licensor, regardless of
            any such verification, all of your interactions with any Licensor
            and any contract you enter into with any Licensor are entirely at
            your own risk.&nbsp;&nbsp;Each Licensor is solely responsible for
            all information posted concerning itself and its Property.
            &nbsp;&nbsp;All information on this Website is provided by BIP
            &ldquo;as is&rdquo; and without any guarantees as to its accuracy
            and veracity.&nbsp;&nbsp;You agree to undertake your own due
            diligence before entering into any contract or using any
            Property.&nbsp;&nbsp;You, and not BIP, are solely responsible for
            all of your interactions with any Licensor, for your use of any
            Property, and for any contract you enter into with any
            Licensor.&nbsp; &nbsp;&nbsp;BIP expressly disclaims all
            representations and warranties, whether express or implied, that any
            Licensor actually owns the Property it purports to own; that any
            Licensor has the authority to represent or license any Property;
            that your use of any Property will not infringe on the rights of any
            third party or constitute misappropriation; that the terms of any
            contract are fair or reasonable; that any Licensor will comply with
            the terms and conditions of any contract; and/or that you will
            derive any economic benefit and/or that you will not suffer any
            economic losses from your use of the Website, from your use of any
            Property, or from any contract you enter into with any Licensor.
          </p>
          <p>
            <strong>Notice of Contracts/Use of Name</strong>
          </p>
          <p>
            You agree to notify BIP through the Website when (a) you enter into
            any contract with a Licensor that you saw on the Website, even if
            you did not negotiate and enter into the contract with the Licensor
            through the Website; and (b) products or services distributed
            pursuant to such contract have been publicly announced or are
            publicly available.&nbsp;&nbsp;You hereby grant to BIP a perpetual,
            worldwide non-exclusive license to use, publish and distribute your
            name and likeness and the name and applicable brands and logos of
            your organization to identify you and your organization as users of
            the Website, that you have contracted with a Licensor through the
            use of the Website, and to generally promote and market the
            Website.&nbsp;&nbsp;BIP agrees that it will not publicly disclose
            any contract or products until such contract or products have been
            publicly disclosed by you or others.
          </p>
          <p>
            <strong>Uploaded User Posts</strong>
          </p>
          <p>
            This Website allows you to upload logos, product images and other
            materials and to post comments and messages in chat rooms (each, a
            &ldquo;User Post&rdquo;). &nbsp;&nbsp;You represent and warrant that
            you have all approvals, rights, titles and interests in and to all
            User Posts you provide and all information they contain which are
            necessary for you to upload and post and for us to use and share
            your User Posts.&nbsp;&nbsp;You further represent and warrant that
            all information contained in all of your User Posts is true,
            accurate and not misleading in any way.&nbsp;&nbsp;You upload and
            display all User Posts at your own risk. BIP makes no representation
            or warranty that your User Posts will be saved or maintained by or
            on this Website or our servers or that you will be able to download
            copies of your User Posts.&nbsp;&nbsp;You are solely responsible for
            maintaining a copy of your User Posts.
          </p>
          <p>
            You agree not to upload any User Post which, in BIP&rsquo;s sole and
            absolute discretion, (a) is infringing, defamatory, obscene,
            pornographic, threatening, abusive, violent, illegal, rude,
            harassing, or otherwise improper; (b) contains viruses, malware or
            other harmful items; or (c) otherwise violates or frustrates the
            purpose of or rules applicable to this Website.&nbsp;&nbsp;BIP, in
            its sole and absolute discretion, may remove or delete any User
            Posts and/or restrict your ability to post User Posts at any time
            without any liability to you.
          </p>
          <p>
            In order to store and share your User Posts on or through the
            Website, you hereby grant (or warrant that the owner of such rights
            has expressly granted) to BIP a royalty-free, non-exclusive right
            and license to use, reproduce, publish, and distribute such
            materials. In addition, you warrant that all so-called &quot;moral
            rights&quot; and other rights recognized throughout the world
            (including without limitation, the European Economic Community) in
            those materials have been waived for the purposes of our use of such
            materials.&nbsp;
          </p>
          <p>
            BIP reserves the right, in its sole discretion, to adopt additional
            rules with respect to the uploading of User Posts and to condition
            access to any feature by any individual or group in accordance with
            geographic or other criteria, to deny or restrict access by any
            individual or group who fails to meet that criteria or by anyone who
            fails to comply with our criteria or rules at any time, and to
            change or modify the criteria or rules at any time.
          </p>
          <p>
            <strong>User Conduct</strong>
          </p>
          <p>
            BIP supports the rights of its users to conduct business free from
            racism, sexism, homophobia, discrimination, hate speech, threats,
            insults, rudeness, and other non-professional
            behaviors.&nbsp;&nbsp;You agree at all times to communicate and
            interact with other users and this Website in a professional manner
            appropriate for civil and polite in-person meetings.&nbsp;&nbsp;BIP
            reserves the right to terminate the account of and ban all future
            access by any user whom BIP, in its sole and absolute discretion,
            thinks has acted in an unprofessional manner either through the
            Website, elsewhere online, or in real life.
          </p>
          <p>
            If you feel that any user has acted in an unprofessional manner, you
            should report such behavior to BIP.&nbsp;&nbsp;While BIP will use
            reasonable efforts to investigate any report, BIP has no obligation
            to monitor or discipline any user or to report to you the results of
            any investigation or the reasons for taking or not taking any
            disciplinary action or the disciplinary actions taken, if
            any.&nbsp;&nbsp;User chat rooms are fully encrypted and not
            monitored or moderated by BIP.&nbsp;&nbsp;Users are solely
            responsible for their interactions with other users.&nbsp;&nbsp;BIP
            has no responsibility or liability for the behavior of any user.
          </p>
          <p>
            You expressly agree that you will not use this Website or any other
            internet services provided by BIP for any purpose that is unlawful
            or prohibited by these terms, conditions, and notices. You agree to
            abide by all applicable local, state, national, and international
            laws and regulations. Any unauthorized commercial use of this
            Website, BIP&rsquo;s servers or internet infrastructure is expressly
            prohibited. You will not use any device, software or routine to
            interfere or attempt to interfere with the proper working of this
            Website as determined by BIP in its sole discretion.
          </p>
          <p>
            Without limiting other restrictions contained in these Terms of Use,
            you agree that you will not, under any circumstances (i) gain or
            attempt to gain unauthorized access to any part of the Website,
            including the accounts of other users (such through the use of bots
            or other automations as well as the unauthorized use of legitimate
            user credentials); (ii) interfere with, disrupt, or damage our
            Website or attempt to do the same (such as by posting viruses,
            instigating a denial of service attack, or spamming users); (iii)
            attempt to gain access to or tamper with non-public areas of the
            Website, our computer systems, and any technical delivery systems of
            our providers; (iv) attempt to prove, scan, or test the
            vulnerability of our systems, networks, or Website, or breach any
            security or authentication measure; (v) conduct facial recognition
            or other biometric analysis of any content on the Website; (vi)
            develop, support or use software, devices, scripts, robots or any
            other means or processes (including crawlers, browser plugins, and
            add-ons or any other technology) to scrape the Website or otherwise
            copy profiles and/or other information from the Website; or (vii)
            otherwise access or use the Website in an unlawful or unanticipated
            manner. For clarity, any attempt to engage in any of the behaviors
            listed in this section is also prohibited.
          </p>
          <p>
            <strong>Unsolicited Submissions</strong>
          </p>
          <p>
            BIP does not accept unsolicited ideas, concepts, proposals or other
            submissions concerning its business or its users&rsquo; businesses.
            &nbsp; Before submitting any materials to BIP, you must first enter
            into a submission agreement either with BIP or one of BIP&rsquo;s
            clients.&nbsp;&nbsp;By submitting any ideas, concepts, proposals or
            other submissions without such an agreement (an &ldquo;Unsolicited
            Submission&rdquo;), you automatically grant (or warrant that the
            owner of such rights has expressly granted) to BIP a perpetual,
            royalty-free, irrevocable, transferable, sublicensable,
            non-exclusive right and license to use, reproduce, modify, adapt,
            publish, translate, create derivative works from, and distribute
            your submission or incorporate your submission into any form,
            medium, or technology (now known or hereafter developed or devised)
            throughout the universe. In addition, you warrant that all so-called
            &ldquo;moral rights&rdquo; and other rights recognized throughout
            the world (including without limitation, the European Economic
            Community) in your submission have been waived and that BIP has the
            unrestricted right to modify, edit, alter and change your submission
            without your or any other person&rsquo;s consent. &nbsp;There is no
            contract, implied or otherwise, that BIP will compensate you for the
            use of your submission and, pursuant to the foregoing, BIP will not
            compensate you for any such use.
          </p>
          <p>
            <strong>
              Ownership of Intellectual Property/Restrictions on Use
            </strong>
          </p>
          <p>
            All software, designs, text, images, photographs, illustrations,
            audio clips, video clips, artwork, graphic material, data and other
            copyrightable elements, and the selection and arrangements thereof,
            and all trademarks, service marks, trade dress and trade names which
            are part of or displayed through this Website (the
            &ldquo;Materials&rdquo;) are the property of BIP or of third parties
            who have authorized BIP to use the Materials and are protected,
            without limitation, pursuant to U.S. and foreign copyright and
            trademark laws. &nbsp;
          </p>
          <p>
            You should assume that everything you see or read on this Website,
            receive through related services, or download from our servers, is
            protected by copyright unless otherwise stated and may only be used
            according to these Terms of Use. BIP does not warrant or represent
            that your use of materials displayed on this Website will not
            infringe rights of third parties whom are not owned or affiliated
            with BIP. Images are either BIP&rsquo;s property or used by BIP with
            another party&rsquo;s permission. The use of these images by you, or
            anyone else authorized by you, is prohibited unless specifically
            permitted by these Terms of Use. Any unauthorized use of such images
            may violate copyright laws, trademark laws, the laws of privacy and
            publicity, as well as other communications regulations and statutes.
          </p>
          <p>
            BIP is a trademark of BIP. &nbsp;The trademarks (including the
            foregoing trademarks), logos, and service marks (collectively the
            &ldquo;Trademarks&rdquo;) displayed on this Website are registered
            and unregistered trademarks of BIP or of third parties who have
            authorized BIP to use the Trademarks. Your misuse of the Trademarks
            displayed on this Website, or any other content on this Website,
            except as provided herein, is strictly prohibited. Nothing contained
            on this Website should be construed as granting any license or right
            to use any Trademark displayed on this Website without the written
            permission of BIP or such third party that may own the Trademark.
          </p>
          <p>
            These Terms of Use grant to you a limited, non-exclusive,
            non-transferable, revocable license to access and use this Website
            and the Materials for your personal, non-commercial use. Except as
            expressly provided herein, you agree that no portion of this Website
            will be accessed, used, reproduced, duplicated, copied, or otherwise
            exploited by you for any other purpose; that you have obtained no
            other rights, titles or interests of any kind in or to this Website
            or the Materials; and that nothing contained herein shall be
            construed as conferring any other right, title or interest. &nbsp;As
            between you and BIP, all rights in the Materials and the Website are
            reserved to BIP.
          </p>
          <p>
            You agree not to reproduce, modify, create derivative works from,
            display, perform, publish, distribute, disseminate, broadcast, sell,
            decompile, reverse engineer, disassemble, or circulate any Materials
            to any third party (including, without limitation, display and
            distribute the Materials via a third party website) without
            BIP&rsquo;s express prior written consent. Unauthorized or
            prohibited exploitation of Materials may subject you to civil
            liability and criminal prosecution under applicable federal and
            state laws.
          </p>
          <p>
            The foregoing paragraphs in this section do not apply to any User
            Post which you own.
          </p>
          <p>
            <strong>Reporting Copyright Infringement&nbsp;</strong>
          </p>
          <p>
            BIP respects the intellectual property of others, and we ask that
            those posting to this site do the same. If you believe that your
            copyrighted work has been copied, and is accessible on this site in
            a way that constitutes copyright infringement, you may notify us by
            providing our copyright agent with the following information:
          </p>
          <ul>
            <li>
              The electronic or physical signature of the owner of the copyright
              or the person authorized to act on the owner&apos;s behalf.
            </li>
            <li>
              A description of the copyrighted work that you claim has been
              infringed and a description of the infringing activity.
            </li>
            <li>
              Location where the original or an authorized copy of the
              copyrighted work exists, such as the URL of the web site where it
              is originally posted or the name of the book in which it has been
              published.
            </li>
            <li>
              Location of the specific URL or other location on this site where
              the material that you claim is infringing is located (please
              provide as much information as possible to allow us to locate the
              material).
            </li>
            <li>Your name, address, telephone number, and email address.</li>
            <li>
              A statement by you that you have a good faith belief that the
              disputed use is not authorized by the copyright owner, its agent,
              or the law.
            </li>
            <li>
              A statement by you, made under penalty of perjury, that the above
              information in your Notice is accurate and that you are the
              copyright owner or are authorized to act on the copyright
              owner&apos;s behalf.
            </li>
          </ul>
          <p>
            Contact information for our agent for notice of claims of copyright
            infringement on this site:
          </p>
          <p>
            BIP Market LLC
            <br />
            300 SE 2nd Street&nbsp;
          </p>
          <p>
            Fort Lauderdale, FL 33301
            <br />
            Attn:_____________________
            <br />
            Phone: ___________________
            <br />
            Fax:_____________________
            <br />
            Email: ___________________
          </p>
          <p>
            <br />
          </p>
          <p>
            <strong>Disclaimers/Limitation of Liability</strong>
          </p>
          <p>
            THIS WEBSITE AND ALL MATERIALS CONTAINED ON IT AND ALL SERVICES
            PROVIDED BY IT AND/OR BIP ARE PROVIDED, DISTRIBUTED AND TRANSMITTED
            ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS,
            WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE
            FULLEST EXTENT PERMISSIBLE UNDER APPLICABLE LAW, BIP DISCLAIMS ALL
            WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, WITHOUT LIMITATION,
            WARRANTIES OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
            BIP DOES NOT WARRANT THAT THE FUNCTIONS CONTAINED IN THE SITE OR
            MATERIALS WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE
            CORRECTED, THAT INFORMATION WILL BE SAVED OR PRESERVED, THAT
            INFORMATION WILL BE MAINTAINED AS CONFIDENTIAL, OR THAT THIS SITE OR
            THE SERVERS THAT MAKE IT AVAILABLE ARE FREE OF VIRUSES OR OTHER
            HARMFUL COMPONENTS. BIP DOES NOT WARRANT OR MAKE ANY REPRESENTATIONS
            REGARDING THE USE OF THIS WEBSITE OR THE INFORMATION CONTAINED IN IT
            WITH REGARD TO THEIR CORRECTNESS, ACCURACY, RELIABILITY, OR
            OTHERWISE. THE ENTIRE RISK AS TO THE QUALITY, ACCURACY, ADEQUACY,
            COMPLETENESS, CORRECTNESS, AND VALIDITY OF ANY MATERIAL RESTS WITH
            YOU. &nbsp;YOU, NOT BIP, ASSUME THE COMPLETE COST OF ALL NECESSARY
            SERVICING, REPAIR, REPLACEMENT, OR CORRECTION.
          </p>
          <p>
            APPLICABLE LAW MAY NOT ALLOW THE EXCLUSION OF IMPLIED WARRANTIES, SO
            THE ABOVE EXCLUSION MAY NOT APPLY TO YOU.
          </p>
          <p>
            WE RESERVE THE RIGHT TO MODIFY AND/OR DISCONTINUE THIS WEBSITE AT
            ANY TIME WITHOUT NOTICE.
          </p>
          <p>
            TO THE EXTENT THAT YOU COMMUNICATE WITH BIP THROUGH ANY SOURCE, THE
            STATEMENTS, PROMISES OR ACTIONS TAKEN BY SUCH SOURCES SHALL NOT
            LIMIT OR OTHERWISE MODIFY THE TERMS OF THIS DISCLAIMER AND/OR THIS
            USER AGREEMENT AND THIS DISCLAIMER AND THESE TERMS OF USE SHALL
            APPLY TO ANY INFORMATION PROVIDED TO YOU THROUGH SUCH SOURCES.
          </p>
          <p>
            TO THE FULLEST EXTENT PERMISSIBLE PURSUANT TO APPLICABLE LAW, BIP,
            ITS AFFILIATES, AND THEIR RESPECTIVE OFFICERS, DIRECTORS, EMPLOYEES,
            AGENTS, LICENSORS, REPRESENTATIVES, AND THIRD PARTY PROVIDERS TO
            THIS WEBSITE WILL NOT BE LIABLE FOR DAMAGES OF ANY KIND INCLUDING,
            WITHOUT LIMITATION, COMPENSATORY, CONSEQUENTIAL, INCIDENTAL,
            INDIRECT, SPECIAL OR SIMILAR DAMAGES, THAT MAY RESULT FROM THE USE
            OF, OR THE INABILITY TO USE, THE MATERIALS CONTAINED ON THIS
            WEBSITE, OR THE LOSS OR DESTRUCTION OR LOSS OF CONFIDENTIALITY OF
            ANY MATERIALS YOU UPLOAD TO THIS WEBSITE, REGARDLESS OF WHETHER THE
            MATERIAL IS PROVIDED OR OTHERWISE SUPPLIED BY BIP, YOU OR ANY THIRD
            PARTY AND REGARDLESS OF WHETHER BIP IS AWARE OF OR HAS BEEN ADVISED
            OF THE POSSIBILITY OF SUCH DAMAGES.
          </p>
          <p>
            IF YOU ARE A CALIFORNIA RESIDENT, YOU WAIVE CALIFORNIA CIVIL CODE
            SECTION 1542, WHICH SAYS: &ldquo;A GENERAL RELEASE DOES NOT EXTEND
            TO CLAIMS WHICH THE CREDITOR DOES NOT KNOW OR SUSPECT TO EXIST IN
            HIS FAVOR AT THE TIME OF EXECUTING THE RELEASE, WHICH, IF KNOWN BY
            HIM MUST HAVE MATERIALLY AFFECTED HIS SETTLEMENT WITH THE
            DEBTOR.&rdquo; &nbsp;
          </p>
          <p>
            WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, IN NO EVENT SHALL
            BIP HAVE ANY LIABILITY TO YOU FOR ANY CLAIMS, DAMAGES, LOSSES, AND
            CAUSES OF ACTION (WHETHER IN CONTRACT, TORT OR OTHERWISE) EXCEEDING
            THE AMOUNT PAID BY YOU, IF ANY, FOR ACCESSING THIS SITE.
          </p>
          <p>
            <strong>Emails</strong>
          </p>
          <p>
            You agree that these Terms of Use, including but not limited to the
            Disclaimers and Limitations of Liability, apply to all emails and
            other electronic communications which you receive from BIP as though
            such email or other electronic communication and all of its content
            were a page of this Website.
          </p>
          <p>
            <strong>Security of Information</strong>
          </p>
          <p>
            We have put physical, electronic and managerial procedures into
            place in order to help safeguard and prevent unauthorized access,
            use and/or disclosure of your information and uploads. Although we
            use reasonable efforts to safeguard the security of your
            information, transmissions made on or through the internet and
            information and submissions stored on our servers or the servers of
            third parties that we use are vulnerable to attack and cannot be
            guaranteed to be secure. In addition, information provided and
            submissions made via email are not protected by encryption and are
            vulnerable to interception during transmission. We disclaim
            responsibility for all negligent acts that may result in the
            unauthorized use and/or&nbsp;disclosure of your information.
          </p>
          <p>
            <strong>Malware</strong>
          </p>
          <p>
            We take great care and pride in creating this Website. We are always
            on the lookout for technical glitches that effect how the Website
            works. When we find them on our end, we will fix them.
            Unfortunately, home computer may cause some glitches that effect how
            you see our Website and that is beyond our control. If you
            experience any unusual behavior, content or ads on the Website, it
            may be the result of Malware on your computer. Malware includes
            computer viruses, key loggers, malicious active content, rogue
            programs and dialers, among others. While we continuously work
            closely with our partners to ensure that everything on the Website
            is working properly, sometimes Malware programs on your personal
            computer may interfere with your experience on our Website and on
            other sites that you visit. Please note that we cannot be
            responsible for the effects of any third-party software including
            Malware on your computer system.
          </p>
          <p>
            <strong>Denial of Access</strong>
          </p>
          <p>
            BIP, for any reason or no reason at all and at its sole discretion,
            may decide that any person shall be denied access to any part or all
            of the Website. The sending of an email notice by BIP to any email
            address associated with the denial shall constitute complete and
            sufficient notice of the denial. By agreeing to these Terms of Use,
            you agree to cease and desist immediately from any attempt to access
            the Website upon issuance of a denial. If you do not cease and
            desist, you hereby consent to an injunction to be entered against
            you by a court of competent jurisdiction, as provided herein,
            permanently enjoining you from attempting to access the Website,
            without BIP having to post any bond or surety therefor.
          </p>
          <p>
            <strong>Indemnification</strong>
          </p>
          <p>
            You agree to indemnify, defend and hold harmless BIP, its
            affiliates, and their respective officers, managers, owners,
            employees, agents, licensors, representatives, and third party
            providers to the Website from and against all losses, expenses,
            damages and costs, including reasonable attorneys&rsquo; fees,
            resulting from any violation of these Terms of Use by you. BIP
            reserves the right to assume, at its sole expense, the exclusive
            defense and control of any matter subject to indemnification by you,
            in which event you will fully cooperate with BIP in asserting any
            available defenses.
          </p>
          <p>
            <strong>Jurisdiction</strong>
          </p>
          <p>
            The Terms of Use and all matters or issues collateral thereto will
            be governed by, construed and enforced in accordance with the laws
            of the State of Florida applicable to contracts executed and
            performed entirely therein (without regard to any principles of
            conflicts of laws). You hereby agree that any action at law or in
            equity arising out of or relating to these Terms of Use or the site
            shall be filed only in the state or federal courts located in
            Broward County, in the State of Florida. Further, you hereby
            expressly consent and submit to the personal jurisdiction of such
            courts for the purposes of litigating any such action.
            &nbsp;Notwithstanding the foregoing, BIP shall be entitled to seek
            in any court of appropriate jurisdiction equitable or injunctive
            relief to enforce these Terms of Use.
          </p>
          <p>
            If you use this Website from other locations you are responsible for
            compliance with local laws and regulations. BIP products are
            available in many parts of the world; however, this Website may
            describe products that are not available in your jurisdiction.
          </p>
          <p>
            <strong>Modification of Terms</strong>
          </p>
          <p>
            BIP may at any time revise these Terms of Use by updating the same
            at this Website without prior notice. Your continued use of this
            Website after such changes are posted will constitute your
            acceptance of such changes.
          </p>
          <p>
            <strong>General</strong>
          </p>
          <p>
            This agreement constitutes the entire agreement between you and BIP
            with respect to this Website and related services and supersedes all
            prior or contemporaneous terms or conditions, oral or written,
            between user and BIP. A printed version of this agreement and of any
            notice given in electronic form shall be admissible in judicial or
            administrative proceedings based upon or relating to this agreement
            to the same extent and subject to the same conditions as other
            business documents and records originally generated and maintained
            in printed form. Any cause of action arising out of or related to
            this Website or its service must commence within one (1) year after
            the cause of action arose; otherwise, such cause of action is
            permanently barred.
          </p>
          <p>
            <br />
          </p>
        </Paper>
      </Layout>
    </div>
  );
};

export default LicensorTerms;
